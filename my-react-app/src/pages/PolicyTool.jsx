import React, { useEffect } from 'react';

function PolicyTool() {
  // Log function 
  const log = (txt) => {
    console.log(txt);
    document.getElementById("log").innerText += txt + "\n";
  };

  // Extract function for policy data
  const extract = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      let netlog = e.target.result;
      let split_netlog = netlog.split("\n");
      let policyNets = [];
      
      // Clear previous results
      const logElement = document.getElementById("log");
      logElement.innerText = "";
      
      // Remove existing network rows except header
      const table = document.getElementById("output-networks");
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      
      // Find the line where the policy was returned
      for (let i = 0; i < split_netlog.length; i++) {
        if (split_netlog[i].includes("ya0NvbmZpZ3VyYXRpb2") || 
            split_netlog[i].includes("vcmtDb25maWd1cmF0aW") || 
            split_netlog[i].includes("rQ29uZmlndXJhdGlvbn") || 
            split_netlog[i].includes("Db25maWd1cmF0aW9ucw")) {
          log("Found policy data at line: " + i);
          policyNets.push(split_netlog[i]);
        }
      }
      
      if (policyNets.length === 0) {
        log("No policy network data found in the file. Please make sure you followed the instructions correctly.");
        return;
      }
      
      policyNets.forEach(policyNet => {
        try {
          policyNet = atob(policyNet.substring(
            (policyNet.indexOf('"bytes":"') + 9), 
            (policyNet.indexOf('"},"phase"'))
          ));
          log("Decoded policy data: " + policyNet.substring(0, 100) + "...");
          
          let NetworkConfigurations = policyNet.substring(
            policyNet.indexOf('"NetworkConfigurations":'), 
            policyNet.indexOf("]\n}b")
          ) + "]";
          
          NetworkConfigurations = NetworkConfigurations.substring(
            0, 
            NetworkConfigurations.search(/}\n *]/)
          );
          
          NetworkConfigurations = NetworkConfigurations.replace(
            /("NetworkConfigurations":|\n)/g, ""
          ) + "}]";
          
          log("Extracted network configurations");
          
          // Using Function instead of eval for better security
          NetworkConfigurations = Function('"use strict";return (' + NetworkConfigurations + ')')();
          
          let networksFound = 0;
          
          for (let wifi in NetworkConfigurations) {
            if (NetworkConfigurations[wifi]["Type"] !== "WiFi") continue; // Skip non WiFi networks
            
            networksFound++;
            log("Processing WiFi network: " + NetworkConfigurations[wifi]["WiFi"]["SSID"]);
            
            let tr = document.createElement("tr");
            
            let SSID = document.createElement("td");
            SSID.innerText = NetworkConfigurations[wifi]["WiFi"]["SSID"];
            
            let Passphrase = document.createElement("td");
            if (NetworkConfigurations[wifi]["WiFi"]["Passphrase"]) {
              Passphrase.innerText = NetworkConfigurations[wifi]["WiFi"]["Passphrase"];
            } else if (
              NetworkConfigurations[wifi]["WiFi"]["Security"] === "WPA-EAP" && 
              NetworkConfigurations[wifi]["WiFi"]["EAP"] && 
              NetworkConfigurations[wifi]["WiFi"]["EAP"]["Password"]
            ) {
              Passphrase.innerText = "Identity: " + 
                NetworkConfigurations[wifi]["WiFi"]["EAP"]["Identity"] + 
                "\nPassword: " + 
                NetworkConfigurations[wifi]["WiFi"]["EAP"]["Password"];
            } else {
              Passphrase.innerText = "NOT FOUND";
            }
            
            let Security = document.createElement("td");
            Security.innerText = NetworkConfigurations[wifi]["WiFi"]["Security"];
            
            let HiddenSSID = document.createElement("td");
            HiddenSSID.innerText = NetworkConfigurations[wifi]["WiFi"]["HiddenSSID"];
            
            tr.appendChild(SSID);
            tr.appendChild(Passphrase);
            tr.appendChild(Security);
            tr.appendChild(HiddenSSID);
            
            document.getElementById("output-networks").appendChild(tr);
          }
          
          if (networksFound === 0) {
            log("No WiFi networks found in the policy data.");
          } else {
            log("Successfully extracted " + networksFound + " WiFi network(s).");
          }
          
        } catch (err) {
          log("Error processing data: " + err.message);
          console.error(err);
        }
      });
    };
    
    reader.onerror = (err) => {
      log("Error reading file: " + err);
    };
  };

  useEffect(() => {
    // Initialize the tool when the component mounts
    const fileInput = document.getElementById("export");
    if (fileInput) {
      fileInput.addEventListener("change", extract);
    }

    // Cleanup when component unmounts
    return () => {
      const fileInput = document.getElementById("export");
      if (fileInput) {
        fileInput.removeEventListener("change", extract);
      }
    };
  }, []);

  return (
    <main id="policy-tool" className="content">
      <div className="card">
        <h1>Policy Password Tool</h1>
        <p><i>This tool should not be used for illegal activity. By using this tool, you acknowledge that you are legally allowed to extract the password(s) in question.</i></p>

        <div className="tool-container">
          <div className="upload-section">
            <h3>Upload Chrome Net Export Log</h3>
            <input type="file" id="export" className="file-input" />
          </div>

          <div className="results-section">
            <h3>Results</h3>
            <div className="table-container">
              <table id="output-networks">
                <thead>
                  <tr>
                    <th>SSID</th>
                    <th>Credentials</th>
                    <th>Security</th>
                    <th>HiddenSSID</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Results will be inserted here by the script */}
                </tbody>
              </table>
            </div>
          </div>

          <div className="log-section">
            <h3>Log</h3>
            <div id="log" className="log-container"></div>
          </div>
        </div>

        <div className="instructions">
          <h2>How to use</h2>
          <ol>
            <li>Visit <code>chrome://net-export</code></li>
            <li>In "OPTIONS" set "Include raw bytes"</li>
            <li>Click "Start Logging to Disk"</li>
            <li>Visit <code>chrome://policy</code></li>
            <li>Click "Reload policies"</li>
            <li>Go back to <code>chrome://net-export</code> and click "Stop logging"</li>
            <li>Upload the saved file here</li>
          </ol>
        </div>
      </div>
    </main>
  );
}

export default PolicyTool; 
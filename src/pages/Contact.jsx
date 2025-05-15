import React from 'react';

function Contact() {
  return (
    <main id="contact" className="content">
      <div className="card contact-card">
        <h1 className="contact-title">Get in touch!</h1>

        <div className="contact-section">
          <h2 className="contact-platform">GitHub</h2>
          <a href="https://github.com/Ev0ze" className="contact-link" target="_blank" rel="noreferrer">github.com/Ev0ze</a>
        </div>

        <div className="contact-section">
          <h2 className="contact-platform">Email</h2>
          <a href="mailto:Ev0ze@ev0ze.dev" className="contact-link">Ev0ze@ev0ze.dev</a>
          <p className="contact-note">
            Every email address ending in @ev0ze.dev belongs to me.
          </p>
        </div>

        <div className="contact-section">
          <h2 className="contact-platform">Discord</h2>
          <p className="contact-info">
            <span className="highlight">Ev0ze</span> (main and only account)
          </p>
        </div>
      </div>
    </main>
  );
}

export default Contact; 
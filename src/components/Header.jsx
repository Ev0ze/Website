import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import './Header.css';

const Header = ({ onThemeSwitch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('macchiato');
  const [isChanging, setIsChanging] = useState(false);
  const textRef = useRef(null);
  const themeButtonRef = useRef(null);

  // Catppuccin themes
  const themes = [
    { id: 'latte', name: 'Latte', emoji: '🥛' },
    { id: 'frappe', name: 'Frappe', emoji: '🧋' },
    { id: 'macchiato', name: 'Macchiato', emoji: '☕' },
    { id: 'mocha', name: 'Mocha', emoji: '🍫' }
  ];

  // Initialize Splitting.js
  useEffect(() => {
    // Set initial body class
    document.body.classList.add(theme);

    // Initialize Splitting and apply animation
    const initializeSplitting = () => {
      if (textRef.current) {
        const results = Splitting({ target: textRef.current, by: 'chars' });
        
        if (results && results[0] && results[0].chars) {
          results[0].chars.forEach((char, index) => {
            char.style.setProperty("--char-index", index);
          });
        }
      }
    };
    
    // Initialize Splitting
    initializeSplitting();
    
    // Re-initialize on window resize to handle potential DOM changes
    window.addEventListener('resize', initializeSplitting);
    
    return () => {
      window.removeEventListener('resize', initializeSplitting);
    };
  }, []);
  
  // Initialize dropdown behavior
  useEffect(() => {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      let timeoutId;
      let isOpen = false;
      const dropdownContent = dropdown.querySelector('.dropdown-content');
      const dropdownButton = dropdown.querySelector('.dropbtn');

      // Function to show dropdown
      const showDropdown = () => {
        clearTimeout(timeoutId);
        if (dropdownContent) {
          dropdownContent.style.visibility = 'visible';
          dropdownContent.style.opacity = '1';
          dropdownContent.style.transform = 'translateY(0)';
          dropdownContent.style.transitionDelay = '0s';
        }
      };

      // Function to hide dropdown
      const hideDropdown = () => {
        if (dropdownContent) {
          dropdownContent.style.visibility = 'hidden';
          dropdownContent.style.opacity = '0';
          dropdownContent.style.transform = 'translateY(-10px)';
          isOpen = false;
          dropdown.classList.remove('active');
        }
      };

      // Function to toggle active state
      const toggleActive = (active) => {
        if (active) {
          dropdown.classList.add('active');
        } else {
          dropdown.classList.remove('active');
        }
      };

      // When mouse enters the dropdown
      const handleMouseEnter = () => {
        if (!isOpen) {
          showDropdown();
        }
      };
      
      // When mouse leaves the dropdown
      const handleMouseLeave = () => {
        if (!isOpen) {
          timeoutId = setTimeout(() => {
            hideDropdown();
          }, 800); // 800ms delay before hiding
        }
      };
      
      // When mouse enters the content
      const handleContentMouseEnter = () => {
        if (!isOpen) {
          clearTimeout(timeoutId);
        }
      };
      
      // When mouse leaves the content
      const handleContentMouseLeave = () => {
        if (!isOpen) {
          timeoutId = setTimeout(() => {
            hideDropdown();
          }, 500); // 500ms delay before hiding when leaving the content
        }
      };
      
      // Toggle dropdown on button click
      const handleButtonClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOpen) {
          // If already open, close it
          hideDropdown();
          toggleActive(false);
        } else {
          // If closed, open it and set a longer timeout
          showDropdown();
          isOpen = true;
          toggleActive(true);

          // Auto-close after 3 seconds
          timeoutId = setTimeout(() => {
            hideDropdown();
            toggleActive(false);
          }, 3000); // 3 seconds
        }
      };
      
      // Close dropdown when clicking outside
      const handleDocumentClick = (e) => {
        if (isOpen && !dropdown.contains(e.target)) {
          hideDropdown();
        }
      };

      // Add event listeners
      dropdown.addEventListener('mouseenter', handleMouseEnter);
      dropdown.addEventListener('mouseleave', handleMouseLeave);
      
      if (dropdownContent) {
        dropdownContent.addEventListener('mouseenter', handleContentMouseEnter);
        dropdownContent.addEventListener('mouseleave', handleContentMouseLeave);
      }
      
      if (dropdownButton) {
        dropdownButton.addEventListener('click', handleButtonClick);
      }
      
      document.addEventListener('click', handleDocumentClick);

      // Clean up function to remove all event listeners
      return () => {
        dropdown.removeEventListener('mouseenter', handleMouseEnter);
        dropdown.removeEventListener('mouseleave', handleMouseLeave);
        
        if (dropdownContent) {
          dropdownContent.removeEventListener('mouseenter', handleContentMouseEnter);
          dropdownContent.removeEventListener('mouseleave', handleContentMouseLeave);
        }
        
        if (dropdownButton) {
          dropdownButton.removeEventListener('click', handleButtonClick);
        }
        
        document.removeEventListener('click', handleDocumentClick);
      };
    });
  }, []);

  const cycleTheme = () => {
    // Get current theme index
    const currentIndex = themes.findIndex(t => t.id === theme);
    // Get next theme index (or loop back to 0)
    const nextIndex = (currentIndex + 1) % themes.length;
    // Get next theme
    const nextTheme = themes[nextIndex].id;
    
    // Remove current theme class
    document.body.classList.remove(theme);
    // Add new theme class
    document.body.classList.add(nextTheme);
    // Update state
    setTheme(nextTheme);
    
    // Call the onThemeSwitch prop if it exists
    if (onThemeSwitch) {
      onThemeSwitch(nextTheme);
    }
    
    // Add animation class
    setIsChanging(true);
    // Remove animation class after animation completes
    setTimeout(() => {
      setIsChanging(false);
    }, 500);
  };

  // Find current theme data
  const currentThemeData = themes.find(t => t.id === theme) || themes[2]; // Default to Macchiato

  return (
    <header>
      <div className="nav-left">
        <div className={`dropdown ${isMenuOpen ? 'active' : ''}`}>
          <button className="dropbtn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            Menu <span className="dropdown-icon">&#9662;</span>
          </button>
          <div className="dropdown-content">
            <Link to="/">Home</Link>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <Link to="/policy-tool">Policy Tool</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
      <div className="nav-center">
        <span className="rotating-text" ref={textRef} data-splitting>evoze.dev</span>
      </div>
      <div className="nav-right">
        <button 
          ref={themeButtonRef}
          onClick={cycleTheme} 
          className={`theme-btn ${isChanging ? 'changing' : ''}`}
        >
          {currentThemeData.emoji} {currentThemeData.name}
        </button>
      </div>
    </header>
  );
}

export default Header; 
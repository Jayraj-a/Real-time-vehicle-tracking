const menuItems = [
  { icon: '⌂', label: 'Dashboard' },
  { icon: '◉', label: 'Live Tracking' },
  { icon: '🚙', label: 'Vehicles' },
  { icon: '🔔', label: 'Alerts', badge: 7 },
  { icon: '◇', label: 'Geofencing' },
  { icon: '▣', label: 'Trip History' },
  { icon: '📊', label: 'Analytics' },
  { icon: '👥', label: 'Drivers' },
  { icon: '📄', label: 'Reports' },
  { icon: '⚙', label: 'Settings' },
]

function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">T</div>
        <span>TrackNow</span>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`menu-item ${
              activePage === item.label ? 'active' : ''
            }`}
            onClick={() => setActivePage(item.label)}
          >
            <span className="menu-icon">{item.icon}</span>

            <span className="menu-label">
              {item.label}
            </span>

            {item.badge && (
              <span className="menu-badge">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">A</div>

        <div className="user-details">
          <strong>Admin</strong>
          <span>Admin</span>
        </div>

        <span className="logout-icon">↪</span>
      </div>
    </aside>
  )
}

export default Sidebar
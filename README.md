# Smart Parking System

A modern, responsive parking slot availability and payment system built with vanilla JavaScript, HTML, and CSS. This system simulates real-time parking data and provides a complete booking and payment experience.

## Features

### 🚗 Parking Management
- **Real-time slot availability** with visual grid display
- **Interactive slot selection** with hover effects and animations
- **Dynamic status updates** every 30 seconds
- **50 parking slots** with different availability states
- **Color-coded legend** for easy understanding

### 💳 Payment System
- **Secure payment simulation** with form validation
- **Multiple duration options** (1, 2, 4, 8, 24 hours)
- **Dynamic cost calculation** based on hourly rates
- **Credit card formatting** with real-time validation
- **Payment confirmation** with booking ID generation

### 📱 User Experience
- **Fully responsive design** for all device sizes
- **Modern glassmorphism UI** with smooth animations
- **Loading states** and error handling
- **Modal-based workflows** for booking and payment
- **Accessibility features** and keyboard navigation

### 🔄 API Integration
- **Mock API simulation** for demonstration
- **Real-time data updates** with configurable intervals
- **Error handling** with fallback to demo data
- **Extensible architecture** for real API integration

## Demo

The system includes:
- 50 parking slots (A01-A50) with random availability
- $5.00/hour base pricing
- Simulated real-time updates
- Complete booking and payment flow
- Responsive design for mobile and desktop

## Installation

### Quick Start
1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. The system will load with demo data automatically

### Using a Development Server
```bash
# Using Node.js http-server
npm install
npm start

# Using Python
python3 -m http.server 8000

# Using Live Server (VS Code extension)
# Right-click index.html and select "Open with Live Server"
```

## Project Structure

```
smart-parking-system/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
├── README.md          # Project documentation
└── api/
    └── parking-data.json  # Mock API data
```

## Technical Details

### Technologies Used
- **HTML5** - Semantic structure and accessibility
- **CSS3** - Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript** - ES6+ features and async/await
- **Font Awesome** - Icons and visual elements

### Key Components

#### ParkingSystem Class
The main application class that handles:
- Data management and API simulation
- UI updates and event handling
- Payment processing and validation
- Real-time updates and state management

#### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Flexible grid layouts
- Touch-friendly interface

#### API Simulation
```javascript
// Example API structure
{
  "slots": [...],
  "rates": { "hourly": 5.00 },
  "lastUpdated": "2024-01-15T10:30:00Z",
  "availableSlots": 18,
  "occupiedSlots": 32
}
```

## Usage Guide

### 1. Viewing Parking Availability
- Green slots: Available for booking
- Red slots: Currently occupied
- Orange slots: Selected for booking

### 2. Booking a Slot
1. Click on any available (green) parking slot
2. Fill in the required booking information:
   - Vehicle number (e.g., ABC-1234)
   - Parking duration
   - Customer name
   - Phone number
3. Review the calculated cost
4. Click "Proceed to Payment"

### 3. Making Payment
1. Review booking summary
2. Enter payment details:
   - Card number (formatted automatically)
   - Expiry date (MM/YY format)
   - CVV (3 digits)
   - Cardholder name
3. Click "Pay Now"
4. Receive booking confirmation with ID

### 4. Real-time Updates
- Slot availability updates automatically every 30 seconds
- Status bar shows current availability counts
- Visual indicators for all state changes

## Customization

### Changing Parking Lot Size
```javascript
// In script.js
this.totalSlots = 50; // Change to desired number
```

### Modifying Pricing
```javascript
// In script.js
this.currentRate = 5.00; // Change hourly rate
```

### API Integration
Replace the mock data generation with real API calls:
```javascript
async loadParkingData() {
    const response = await fetch('https://your-api.com/parking/status');
    this.parkingData = await response.json();
}
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- **First Load**: ~1.5s (simulated API delay)
- **Update Frequency**: 30 seconds
- **Bundle Size**: ~15KB (CSS + JS)
- **Mobile Optimized**: Touch-friendly interface

## Security Notes

⚠️ **Important**: This is a demonstration project with simulated payment processing. For production use:

- Implement proper payment gateway integration (Stripe, PayPal, etc.)
- Add server-side validation and security
- Use HTTPS for all transactions
- Implement proper authentication and authorization
- Add input sanitization and XSS protection

## Future Enhancements

- [ ] Real-time WebSocket connections
- [ ] Mobile app integration
- [ ] QR code generation for parking access
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Accessibility improvements
- [ ] Unit and integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue on GitHub
- Email: support@smartparking.com
- Documentation: [API Docs](https://api.smartparking.com/docs)

---

**Built with ❤️ for modern parking solutions**
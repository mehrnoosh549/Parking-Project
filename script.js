// Parking System JavaScript
class ParkingSystem {
    constructor() {
        this.parkingData = null;
        this.selectedSlot = null;
        this.currentRate = 5.00;
        this.totalSlots = 50;
        this.apiBaseUrl = 'https://jsonplaceholder.typicode.com'; // Mock API base
        this.localApiUrl = './api'; // Local mock API endpoint
        
        this.initializeSystem();
    }

    async initializeSystem() {
        this.showLoading();
        try {
            await this.loadParkingData();
            this.setupEventListeners();
            this.generateParkingGrid();
            this.updateStatusBar();
            this.startRealTimeUpdates();
        } catch (error) {
            console.error('Failed to initialize parking system:', error);
            this.handleApiError();
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Mock API data generation since we don't have a real backend
    generateMockParkingData() {
        const slots = [];
        const occupancyRate = 0.6; // 60% occupied
        
        for (let i = 1; i <= this.totalSlots; i++) {
            const isOccupied = Math.random() < occupancyRate;
            slots.push({
                id: `A${i.toString().padStart(2, '0')}`,
                status: isOccupied ? 'occupied' : 'available',
                vehicleNumber: isOccupied ? this.generateRandomVehicleNumber() : null,
                startTime: isOccupied ? new Date(Date.now() - Math.random() * 8 * 60 * 60 * 1000) : null,
                duration: isOccupied ? Math.floor(Math.random() * 8) + 1 : null
            });
        }

        return {
            slots: slots,
            rates: {
                hourly: this.currentRate,
                daily: this.currentRate * 20, // Discount for daily
                currency: 'USD'
            },
            lastUpdated: new Date().toISOString(),
            totalSlots: this.totalSlots,
            availableSlots: slots.filter(slot => slot.status === 'available').length,
            occupiedSlots: slots.filter(slot => slot.status === 'occupied').length
        };
    }

    generateRandomVehicleNumber() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        return `${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(Math.floor(Math.random() * letters.length))}${letters.charAt(Math.floor(Math.random() * letters.length))}-${numbers.charAt(Math.floor(Math.random() * numbers.length))}${numbers.charAt(Math.floor(Math.random() * numbers.length))}${numbers.charAt(Math.floor(Math.random() * numbers.length))}${numbers.charAt(Math.floor(Math.random() * numbers.length))}`;
    }

    async loadParkingData() {
        try {
            // Try to fetch from a real API first (this will fail, but we'll catch it)
            // const response = await fetch(`${this.apiBaseUrl}/parking/status`);
            // if (!response.ok) throw new Error('API not available');
            // this.parkingData = await response.json();
            
            // For demo purposes, we'll use mock data
            throw new Error('Using mock data for demo');
        } catch (error) {
            console.log('Using mock data:', error.message);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            this.parkingData = this.generateMockParkingData();
            this.currentRate = this.parkingData.rates.hourly;
        }
    }

    async updateParkingData() {
        try {
            // In a real application, this would fetch fresh data from the API
            // For demo purposes, we'll simulate some changes
            const availableSlots = this.parkingData.slots.filter(slot => slot.status === 'available');
            const occupiedSlots = this.parkingData.slots.filter(slot => slot.status === 'occupied');
            
            // Randomly change 1-2 slots status
            const slotsToChange = Math.floor(Math.random() * 3);
            for (let i = 0; i < slotsToChange; i++) {
                if (Math.random() > 0.5 && availableSlots.length > 0) {
                    // Make an available slot occupied
                    const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
                    randomSlot.status = 'occupied';
                    randomSlot.vehicleNumber = this.generateRandomVehicleNumber();
                    randomSlot.startTime = new Date();
                    randomSlot.duration = Math.floor(Math.random() * 8) + 1;
                } else if (occupiedSlots.length > 0) {
                    // Make an occupied slot available
                    const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
                    randomSlot.status = 'available';
                    randomSlot.vehicleNumber = null;
                    randomSlot.startTime = null;
                    randomSlot.duration = null;
                }
            }
            
            this.parkingData.lastUpdated = new Date().toISOString();
            this.parkingData.availableSlots = this.parkingData.slots.filter(slot => slot.status === 'available').length;
            this.parkingData.occupiedSlots = this.parkingData.slots.filter(slot => slot.status === 'occupied').length;
            
            this.updateParkingGrid();
            this.updateStatusBar();
        } catch (error) {
            console.error('Failed to update parking data:', error);
        }
    }

    generateParkingGrid() {
        const grid = document.getElementById('parking-grid');
        grid.innerHTML = '';

        this.parkingData.slots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = `parking-slot ${slot.status}`;
            slotElement.textContent = slot.id;
            slotElement.dataset.slotId = slot.id;
            
            if (slot.status === 'available') {
                slotElement.addEventListener('click', () => this.selectSlot(slot.id));
            }
            
            grid.appendChild(slotElement);
        });
    }

    updateParkingGrid() {
        const slots = document.querySelectorAll('.parking-slot');
        slots.forEach(slotElement => {
            const slotId = slotElement.dataset.slotId;
            const slotData = this.parkingData.slots.find(slot => slot.id === slotId);
            
            if (slotData) {
                slotElement.className = `parking-slot ${slotData.status}`;
                
                // Remove existing event listeners and add new ones if needed
                slotElement.replaceWith(slotElement.cloneNode(true));
                const newSlotElement = document.querySelector(`[data-slot-id="${slotId}"]`);
                
                if (slotData.status === 'available') {
                    newSlotElement.addEventListener('click', () => this.selectSlot(slotId));
                }
            }
        });
    }

    selectSlot(slotId) {
        // Clear previous selection
        document.querySelectorAll('.parking-slot.selected').forEach(slot => {
            const slotData = this.parkingData.slots.find(s => s.id === slot.dataset.slotId);
            slot.className = `parking-slot ${slotData.status}`;
        });

        // Select new slot
        const slotElement = document.querySelector(`[data-slot-id="${slotId}"]`);
        slotElement.classList.add('selected');
        
        this.selectedSlot = slotId;
        document.getElementById('selected-slot').value = slotId;
        
        // Enable the booking form
        this.updateBookingForm();
    }

    updateStatusBar() {
        document.getElementById('available-count').textContent = this.parkingData.availableSlots;
        document.getElementById('occupied-count').textContent = this.parkingData.occupiedSlots;
        document.getElementById('hourly-rate').textContent = `$${this.currentRate}/hr`;
    }

    updateBookingForm() {
        const bookBtn = document.querySelector('.book-btn');
        const selectedSlot = document.getElementById('selected-slot').value;
        const vehicleNumber = document.getElementById('vehicle-number').value;
        const duration = document.getElementById('duration').value;
        const customerName = document.getElementById('customer-name').value;
        const phone = document.getElementById('phone').value;

        const isFormValid = selectedSlot && vehicleNumber && duration && customerName && phone;
        bookBtn.disabled = !isFormValid;

        if (duration) {
            this.updateCostDisplay(parseFloat(duration));
        }
    }

    updateCostDisplay(hours) {
        const total = hours * this.currentRate;
        document.getElementById('display-duration').textContent = `${hours} hour${hours !== 1 ? 's' : ''}`;
        document.getElementById('display-rate').textContent = `$${this.currentRate.toFixed(2)}/hr`;
        document.getElementById('total-cost').textContent = `$${total.toFixed(2)}`;
    }

    setupEventListeners() {
        // Form input listeners
        const formInputs = ['vehicle-number', 'duration', 'customer-name', 'phone'];
        formInputs.forEach(inputId => {
            document.getElementById(inputId).addEventListener('input', () => {
                this.updateBookingForm();
            });
        });

        // Duration change listener
        document.getElementById('duration').addEventListener('change', (e) => {
            if (e.target.value) {
                this.updateCostDisplay(parseFloat(e.target.value));
            }
        });

        // Booking form submission
        document.getElementById('booking-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.showPaymentModal();
        });

        // Payment form submission
        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPayment();
        });

        // Modal close listeners
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Card number formatting
        document.getElementById('card-number').addEventListener('input', this.formatCardNumber);
        document.getElementById('expiry').addEventListener('input', this.formatExpiry);
        document.getElementById('cvv').addEventListener('input', this.formatCVV);
    }

    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        const selectedSlot = document.getElementById('selected-slot').value;
        const vehicleNumber = document.getElementById('vehicle-number').value;
        const duration = document.getElementById('duration').value;
        const total = parseFloat(duration) * this.currentRate;

        // Update summary
        document.getElementById('summary-slot').textContent = selectedSlot;
        document.getElementById('summary-vehicle').textContent = vehicleNumber;
        document.getElementById('summary-duration').textContent = `${duration} hour${duration !== '1' ? 's' : ''}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;

        modal.style.display = 'block';
    }

    async processPayment() {
        const payBtn = document.querySelector('.pay-btn');
        const originalText = payBtn.innerHTML;
        
        // Show loading state
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        payBtn.disabled = true;

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Simulate payment API call
            const paymentData = {
                slotId: this.selectedSlot,
                vehicleNumber: document.getElementById('vehicle-number').value,
                customerName: document.getElementById('customer-name').value,
                phone: document.getElementById('phone').value,
                duration: parseFloat(document.getElementById('duration').value),
                amount: parseFloat(document.getElementById('duration').value) * this.currentRate,
                cardNumber: document.getElementById('card-number').value.replace(/\s/g, '').slice(-4),
                timestamp: new Date().toISOString()
            };

            // In a real app, you would send this to your payment API
            console.log('Payment processed:', paymentData);
            
            // Update slot status
            const slot = this.parkingData.slots.find(s => s.id === this.selectedSlot);
            if (slot) {
                slot.status = 'occupied';
                slot.vehicleNumber = paymentData.vehicleNumber;
                slot.startTime = new Date();
                slot.duration = paymentData.duration;
            }

            // Update UI
            this.updateParkingGrid();
            this.updateStatusBar();
            
            // Close payment modal and show success
            document.getElementById('payment-modal').style.display = 'none';
            this.showSuccessModal(paymentData);
            
            // Reset form
            this.resetBookingForm();

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            payBtn.innerHTML = originalText;
            payBtn.disabled = false;
        }
    }

    showSuccessModal(paymentData) {
        const modal = document.getElementById('success-modal');
        const bookingId = 'PK' + Date.now().toString().slice(-8);
        document.getElementById('booking-id').textContent = bookingId;
        modal.style.display = 'block';
    }

    resetBookingForm() {
        document.getElementById('booking-form').reset();
        document.getElementById('selected-slot').value = '';
        document.getElementById('display-duration').textContent = '0 hours';
        document.getElementById('total-cost').textContent = '$0.00';
        document.querySelector('.book-btn').disabled = true;
        
        // Clear selected slot
        document.querySelectorAll('.parking-slot.selected').forEach(slot => {
            const slotData = this.parkingData.slots.find(s => s.id === slot.dataset.slotId);
            slot.className = `parking-slot ${slotData.status}`;
        });
        
        this.selectedSlot = null;
    }

    // Card formatting functions
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }

    formatExpiry(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    formatCVV(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }

    startRealTimeUpdates() {
        // Update parking data every 30 seconds
        setInterval(() => {
            this.updateParkingData();
        }, 30000);

        // Update time display every minute
        setInterval(() => {
            const lastUpdated = new Date(this.parkingData.lastUpdated);
            const now = new Date();
            const diffMinutes = Math.floor((now - lastUpdated) / (1000 * 60));
            
            // You could add a "last updated" indicator here if needed
            console.log(`Data last updated ${diffMinutes} minutes ago`);
        }, 60000);
    }

    handleApiError() {
        // Show error message to user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Using demo data - API unavailable';
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Global functions for modal handling
function closeSuccessModal() {
    document.getElementById('success-modal').style.display = 'none';
}

// Initialize the parking system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.parkingSystem = new ParkingSystem();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParkingSystem;
}
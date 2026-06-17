/**
 * Calendar Module
 * Manages weekly calendar view and navigation
 */
class Calendar {
  constructor() {
    this.currentDate = new Date(); // Today's date as reference
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    this.dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  /**
   * Generate calendar for current week (7 days: Monday-Sunday)
   * Displays compact week view with navigation to previous/next weeks
   */
  generateCalendar() {
    // Find the Monday of the current week
    const dayOfWeek = this.currentDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Create a new date for Monday of this week
    const weekStart = new Date(this.currentDate);
    weekStart.setDate(weekStart.getDate() - daysToMonday);

    // Update the calendar header to display month and year of the week
    document.getElementById('monthName').textContent = this.monthNames[weekStart.getMonth()];
    document.getElementById('yearName').textContent = weekStart.getFullYear();

    // Clear the calendar grid and prepare to add 7 days for the week
    const daysGrid = document.getElementById('daysGrid');
    daysGrid.innerHTML = '';

    // Get today's date for highlighting
    const today = new Date();

    // Generate exactly 7 cells for each day of the week (Monday through Sunday)
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);

      const dayNumber = dayDate.getDate();

      // Create day cell element for the calendar
      const dayCell = document.createElement('div');
      dayCell.className = 'day-cell';
      dayCell.textContent = dayNumber;
      dayCell.setAttribute('data-day', this.dayNames[i]);

      // Automatically select today's date
      if (dayNumber === today.getDate() &&
        dayDate.getMonth() === today.getMonth() &&
        dayDate.getFullYear() === today.getFullYear()) {
        dayCell.classList.add('selected');
      }

      // Add click listener to select the day
      dayCell.addEventListener('click', () => {
        const allDays = daysGrid.querySelectorAll('.day-cell');
        allDays.forEach(day => day.classList.remove('selected'));
        dayCell.classList.add('selected');

        console.log(`Selected: ${this.monthNames[dayDate.getMonth()]} ${dayNumber}, ${dayDate.getFullYear()}`);
      });

      daysGrid.appendChild(dayCell);
    }
  }

  /**
   * Navigate to previous week
   * Moves the calendar back by 7 days and regenerates the week display
   */
  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.generateCalendar();
  }

  /**
   * Navigate to next week
   * Moves the calendar forward by 7 days and regenerates the week display
   */
  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.generateCalendar();
  }

  /**
   * Get the currently selected date
   * 
   * @returns {Date} The selected date
   */
  getSelectedDate() {
    return new Date(this.currentDate);
  }
}

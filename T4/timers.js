/**
 * A list of Timer objects. You may assume that each Timer has a unique `id`.
 */
const timers = [];

/** Next unique timer id to assign. */
let next_id = 1;

/**
 * A single countdown timer.
 *
 * The Timer object owns the countdown state and periodic ticking logic.
 * It does not know about how it is rendered. Instead, it relies on the two 
 * callback functions (described below).
 */
class Timer {
    /**
     * Construct a Timer and start its periodic tick.
     *
     * @param {number} minutes Starting minutes (non-negative integer).
     * @param {number} seconds Starting seconds (non-negative integer).
     * @param {(m:number, s:number) => void} update Callback to re-render the timer.
     * @param {() => void} remove Callback to remove this timer.
     */
    constructor(minutes, seconds, update, remove) {
        this.id = next_id;
        next_id += 1;

        // These are stored so your methods can call them later.
        this.update = update;
        this.remove = remove;
        this.minutes = minutes; 
        this.seconds = seconds;
        this.expired = false; 

        /**
         * TODO (Part 1): Complete the constructor and start a periodic 
         * callback using setInterval to update the timer once every 1 second,
         * until it reaches 00:00.
         */
        this.start();
        
    }

    /* TODO: Add other helper methods as you see fit. */
    start() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.intervalId = setInterval(() => {
            if (this.minutes === 0 && this.seconds === 0) {
                this.expired = true;
                this.end();
                return;
            } 

            this.seconds -= 1;
            
            if (this.seconds < 0) {
                if (this.minutes > 0) {
                    this.minutes -= 1;
                    this.seconds = 59;
                } else { 
                    this.expired = true; 
                    this.end();
                    return;
                }
            }
            this.update(this.minutes, this.seconds);
            update_stats();
            
        }, 1000)
    }
    end () {
        clearInterval(this.intervalId);
        update_stats();
    }
}

/**
 * Recompute and display aggregate timer statistics in the sidebar.
 *
 * Expected behaviour:
 * - Counts active vs expired timers based on each Timer's state.
 * - Displays the average remaining time (in seconds) across all timers.
 * - If there are no timers, the average remaining time should be 0.
 * - This function only updates the DOM; it should not mutate `timers`.
 */
function update_stats() {
    const num_active_timers = document.getElementById("num_active_timers");
    const num_expired_timers = document.getElementById("num_expired_timers");
    const avg_remain_time = document.getElementById("avg_remain_time");

    /**
     * TODO (Part 2): Complete these stats calculations.
     * Hint: use Array.reduce on the `timers` global array.
     */
    let num_expired = timers.reduce((total, timer) => {
        if (timer.expired === true) {
            total += 1;
        }
        return total;
    }, 0);
    let num_active = timers.reduce((total, timer) => {
        if (timer.expired === false) {
            total += 1;
        }
        return total;
    }, 0);
    let avg_seconds = timers.reduce((count, timer) => {
        count += timer.minutes * 60 + timer.seconds;
        
        return count ;
    }, 0);
    if (timers.length > 0) {
        avg_seconds = avg_seconds / timers.length;
    }
    else {
        avg_seconds = 0;
    }

    num_active_timers.innerHTML = num_active;
    num_expired_timers.innerHTML = num_expired;
    avg_remain_time.innerHTML = Math.ceil(avg_seconds);
}

/**
 * Create a new timer from user input. DO NOT CHANGE THIS FUNCTION.
 *
 * @param {Event} event Submit event from the form.
 * @param {HTMLFormElement} form The form element containing user inputs.
 * @returns {boolean} Always returns false to prevent page navigation.
 */
function create_timer(event, form) {
    // We do not want to submit a request
    event.preventDefault();

    const name = form["name"].value.trim();
    const minutes = Number.parseInt(form["minutes"].value, 10);
    const seconds = Number.parseInt(form["seconds"].value, 10);
    const error = form.getElementsByClassName("error")[0];

    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) ||
        minutes < 0 || seconds < 0 || minutes * 60 + seconds <= 0) {
        error.innerHTML = "Value must be greater than zero.";
        return false;
    }
    error.innerHTML = "";

    const container = document.createElement("details");
    const new_id = next_id;

    const remove = () => {
        const idx = timers.findIndex((elem) => elem.id === new_id);
        if (idx !== -1) {
            timers.splice(idx, 1);
        }
        container.remove();
    };

    const seconds_padded = String(seconds).padStart(2, "0");
    container.innerHTML = `
        <summary>${name}<a href="#">&#x274c;</a></summary>
        <div>
          <span class="minutes">${minutes}</span>:<span class="seconds">${seconds_padded}</span>
        </div>
    `;
    container.setAttribute("open", "");

    const minutes_span = container.querySelector(".minutes");
    const seconds_span = container.querySelector(".seconds");
    const update = (m, s) => {
        minutes_span.textContent = m;
        seconds_span.textContent = String(s).padStart(2, "0");
    };

    const timer = new Timer(minutes, seconds, update, remove);
    const anchor = container.querySelector("a");
    anchor.addEventListener("click", (e) => {
        e.preventDefault();
        remove();
    });

    const main = document.getElementById("main");
    main.appendChild(container);
    timers.push(timer);

    return false;
}

/**
 * Extend all timers by a given number of seconds.
 *
 * @param {Event} event Submit event from the form.
 * @param {HTMLFormElement} form The form element containing user inputs.
 * @returns {boolean} Always returns false to prevent page navigation.
 */
function extend_all_timers(event, form) {
    event.preventDefault();

    let seconds = Number.parseInt(form["seconds"].value, 10);
    const error = form.getElementsByClassName("error")[0];

    if (!Number.isFinite(seconds) || seconds <= 0) {
        error.innerHTML = "Value must be greater than zero.";
        return false;
    }
    error.innerHTML = "";

    /**
     * TODO (Part 3): Extend all timers by `seconds`.
     * Hint: use Array.forEach on the `timers` global array.
     */
    timers.forEach((timer) => {
        timer.seconds += seconds;
        while (timer.seconds >= 60) {
            timer.seconds = timer.seconds - 60;
            timer.minutes += 1;
        }
        if (timer.expired === true) {
            timer.expired = false;
            timer.start();
        }
        timer.update(timer.minutes, timer.seconds);
    })
    update_stats();
    return false;
}

/**
 * Remove all expired timers from the page.
 * 
 * @param {Event} event Click event from the "Clear" button.
 * @returns {boolean} Always returns false to prevent page navigation.
 */
function clear_expired_timers(event) {
    event.preventDefault();

    /**
     * TODO (Part 4): Remove all expired timers.
     * Hint: use Array.filter to select expired timers.
     */
    timers.filter((timer) => {
        return timer.expired === true;
    }).forEach((timer) => timer.remove());
    update_stats();

    return false;
}

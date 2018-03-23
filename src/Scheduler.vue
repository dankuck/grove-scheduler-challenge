<template>
    <div class="row">
        <div v-if="error" class="col-lg-12 text-danger">
            Unable to load schedules.
        </div>
        <div v-else-if="schedules">
            <div class="col-lg-6">
                <h2>Happening Now</h2>
                <scheduler-list 
                    :schedules="sortedSchedulesNow"
                    relax-msg="All clear! Relax."
                >
                </scheduler-list>
            </div>
            <div class="col-lg-6">
                <h2>The Next 24 Hours</h2>
                <scheduler-list 
                    :schedules="sortedSchedulesNext24Hours"
                    relax-msg="Nothing. Go home."
                >
                </scheduler-list>
            </div>
            <div class="col-lg-6">
                <h2>All Schedules</h2>
                <scheduler-list 
                    :schedules="sortedSchedules"
                    relax-msg="You need a hobby. Put something on this list."
                >
                </scheduler-list>
            </div>
        </div>
        <div v-else class="col-lg-12 text-center">
            Fetching schedules...
        </div>
    </div>
</template>

<script>
import cronparser from 'cron-parser';

export default {
    props: ['scheduleEndpoint'],
    data() {
        return {
            schedules: null,
            error: false,
        };
    },
    mounted() {
        // To keep our schedules fresh and enable timely notifications,
        // we check the schedules every half-second.
        setInterval(() => {
            this.checkSchedules();
        }, 500);

        this.loadSchedules();

        if (window.Notification && Notification.permission != 'granted') {
            Notification.requestPermission();
        }
    },
    computed: {
        // Provide a sorted list of the scheduled tasks for use by the UI.
        sortedSchedules() {
            if (!this.schedules) {
                return [];
            }
            let schedules = this.schedules.slice(); // aka copy
            schedules.sort((a, b) => {
                if (a.next.toDate() < b.next.toDate()) {
                    return -1;
                } else if (a.next.toDate() > b.next.toDate()) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return schedules;
        },

        // Provide a list of only schedules coming up right away
        sortedSchedulesNow() {
            let now = new Date();
            return this.sortedSchedules
                .filter(schedule => schedule.next.toDate() - now < 60000);
        },

        // Provide a list of only schedules coming up in the next 24 hours
        sortedSchedulesNext24Hours() {
            let now = new Date();
            return this.sortedSchedules
                .filter(schedule => schedule.next.toDate() - now < 24 * 60 * 60000);
        },
    },
    methods: {
        // Pull the schedules from the endpoint and refactor them to our needs
        loadSchedules() {
            this.$http.get(this.scheduleEndpoint)
                .then(
                    response => {
                        this.schedules = response.data.data.map(schedule => {
                            return {
                                name: schedule.attributes.name,
                                cron: schedule.attributes.cron,
                                next: null,
                                lastNotified: null,
                            };
                        });
                        this.checkSchedules();
                    },
                    response => this.error = true
                );
        },

        // Keep each schedule up to date on its next event.
        // Also check each schedule to see if it's about to happen. If so, 
        // notify the user.
        checkSchedules() {
            if (!this.schedules) {
                return;
            }
            let now = new Date();
            this.schedules
                .forEach(schedule => {
                    schedule.next = cronparser.parseExpression(schedule.cron).next();
                    let scheduleDate = schedule.next.toDate();
                    if (scheduleDate - now < 1000 && (!schedule.lastNotified || schedule.lastNotified < scheduleDate)) {
                        this.notify(schedule);
                    }
                });
        },

        // Notify the user that a scheduled time has arrived
        notify(schedule) {
            schedule.lastNotified = new Date();
            if (window.console && console.log) {
                console.log('time for', schedule);
            }
            if (window.Notification) {
                new Notification(schedule.name);
            }
        },
    },
}
</script>

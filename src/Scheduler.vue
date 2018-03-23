<template>
    <div class="row">
        <div v-if="error" class="col-lg-12 text-danger">
            Unable to load schedules.
        </div>
        <div v-else-if="schedules" class="col-lg-12">
            <ul class="list-group">
                <li 
                    v-for="schedule in sortedSchedules" 
                    class="list-group-item"
                >
                    <span class="badge">{{ schedule.next._date.fromNow() }}</span>
                    {{ schedule.name }}
                </li>
            </ul>
        </div>
        <div v-else class="col-lg-12">
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
        setInterval(() => {
            this.checkSchedules();
        }, 500);
        this.loadSchedules();
    },
    computed: {
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
    },
    methods: {
        loadSchedules() {
            this.$http.get(this.scheduleEndpoint)
                .then(
                    response => {
                        this.schedules = response.data.data.map(schedule => {
                            return {
                                name: schedule.attributes.name,
                                cron: schedule.attributes.cron,
                                next: null,
                            };
                        });
                        this.checkSchedules();
                    },
                    response => this.error = true
                );
        },
        checkSchedules() {
            if (!this.schedules) {
                return;
            }
            this.schedules
                .forEach(schedule => {
                    schedule.next = cronparser.parseExpression(schedule.cron).next();
                });
        },
    },
}
</script>

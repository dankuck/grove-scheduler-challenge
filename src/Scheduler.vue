<template>
    <div class="row">
        <div v-if="error" class="col-lg-12 text-danger">
            Unable to load schedules.
        </div>
        <div v-else-if="schedules" class="col-lg-12">
            <ul>
                <li v-for="schedule in sortedSchedules">
                    {{ schedule.attributes.name }} on {{ schedule.next }}
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
                        let schedules = response.data.data;
                        schedules
                            .forEach(schedule => {
                                schedule.cronInterval = cronparser.parseExpression(schedule.attributes.cron);
                            });
                        this.schedules = schedules;
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
                    schedule.next = schedule.cronInterval.next();
                });
        },
    },
}
</script>

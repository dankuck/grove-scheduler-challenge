<template>
    <div class="row">
        <div v-if="error" class="col-lg-12 text-danger">
            Unable to load schedules.
        </div>
        <div v-else-if="schedules" class="col-lg-12">
            <ul>
                <li v-for="schedule in schedules">
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
    methods: {
        checkSchedules() {
            this.schedules
                .forEach(schedule => {
                    schedule.next = schedule.cronInterval.next();
                });
        },
    },
}
</script>

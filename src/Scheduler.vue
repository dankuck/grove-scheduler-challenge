<template>
    <div class="row">
        <div v-if="error" class="col-lg-12 text-danger">
            Unable to load schedules.
        </div>
        <div v-else-if="schedules" class="col-lg-12">
            got schedules
        </div>
        <div v-else class="col-lg-12">
            Fetching schedules...
        </div>
    </div>
</template>

<script>
export default {
    props: ['scheduleEndpoint'],
    data() {
        return {
            schedules: null,
            error: false,
        };
    },
    mounted() {
        this.$http.get(this.scheduleEndpoint)
            .then(
                response => this.schedules = response.data.data,
                response => this.error = true
            );
    },
}
</script>

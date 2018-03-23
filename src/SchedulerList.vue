<template>
    <div>
        <ul v-if="schedules.length > 0" class="list-group">
            <li 
                v-for="schedule in schedules" 
                class="list-group-item"
            >
                <span class="badge">{{ schedule.next._date.fromNow() }}</span>
                <div class="title">{{ schedule.name }}</div>
                <div class="next">Next: {{ schedule.next.toString() }}</div>
            </li>
        </ul>
        <p v-else>
            {{ relaxMsg }}
        </p>
    </div>
</template>

<script>
export default {
    props: ['schedules', 'relaxMsg'],
}
</script>

<style>
.title {
    font-size: 130%;
    margin-bottom: .5em;
}

.next {
    color: #888;
    font-size: 90%;
}
</style>

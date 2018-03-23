<template>
    <div>
        <ul v-if="schedules.length > 0" class="list-group">
            <li 
                v-for="schedule in schedules" 
                class="list-group-item"
            >
                <span class="badge">{{ schedule.next._date.fromNow() }}</span>
                {{ schedule.name }}
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

<template>
    <img class="logo" alt="SPARC logo" :src="logo"/>
</template>

<script>
    import logo from "@/static/images/logo-sparc-wave-primary.svg"

    export default {
        name: 'sparc-logo',
        data: () => ({
            logo
        })
    }
</script>

<style scoped lang="scss">
    .logo {
        height: 100%;
    }
</style>
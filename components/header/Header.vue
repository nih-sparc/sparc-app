<template>
    <div class="nav">

        
        <el-row type="flex" justify="center">
            <el-col :xs="22" :sm="22" :md="22" :lg="18" :xl="16">
                <div class="header">
                    <div class="logo">
                        <sparc-logo/>
                    </div>
                    <button
                        class="btn-menu"
                        @click="menuOpen = true"
                    >
                        <i class="el-icon-s-fold"></i>
                    </button>
                    <div
                        class="navigation"
                        :class="{ 'open': menuOpen }"
                    >
                        <div class="mobile-navigation-header">
                            <sparc-logo
                                aria-hidden=”true”
                                role="presentation"
                            />
                            <button
                                class="btn-menu"
                                @click="menuOpen = false"
                            >
                                <i class="el-icon-close"></i>
                            </button>
                        </div>
                        <ul>
                            <li :key="link.href" v-for="link in links">
                                <a v-bind:class="{active: link.active}" :href="link.href">{{ link.title }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import SparcLogo from "../logo/SparcLogo.vue";

    const path = () =>  "";
    const hash = () =>  "";

    const pathOrHashContainsString = (query) => (path().indexOf(query) > -1) || (hash().indexOf(query) > -1);


    const links = [
        {
            title: "Home",
            href: "/",
            active: pathOrHashContainsString("/")
                && !pathOrHashContainsString("/about")
                && !pathOrHashContainsString("/browse")
                && !pathOrHashContainsString("/map")
                && !pathOrHashContainsString("/sim")
        },
        {
            title: "Explore Data",
            href: "/data",
            active: pathOrHashContainsString("/data")
        },
        {
            title: "SPARC Resources",
            href: "/map",
            active: pathOrHashContainsString("/map")
        },
        {
            title: "SPARC Events",
            href: "/events",
            active: pathOrHashContainsString("/events")
        },
        {
            title: "About",
            href: "/about",
            active: pathOrHashContainsString("/about")
        },
        {
            title: "Help",
            href: "/help",
            active: pathOrHashContainsString("/help")
        }
    ];

    export default {
        name: 'sparc-header',
        components: {
            SparcLogo
        },
        data: () => ({
            links,
            menuOpen: false
        })
    }
</script>

<style scoped lang="scss">
    @import '@/assets/_variables.scss';

    .nav {
        height: 4em;
        padding: 0;
        padding-top: 1rem;
    }

    .header {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        @media screen and (max-width: 767px) {
            align-items: center;
        }

        .logo {
            height: 40px;
            white-space: nowrap;
        }
    }

    .btn-menu {
        background: none;
        border: none;
        display: none;
        font-size: 24px;
        margin: 0;
        padding: 10px;
        transform: translate(12px, -8px);
        -webkit-appearance: none;

        @media screen and (max-width: 767px) {
            & {
                display: block;
            }
        }
        i {
            display: block;
        }
    }

    .navigation {
        padding: 0px;
        height: 100%;

        ul {
            li {
                display: inline;
                margin: 0px 10px;

                a {
                    text-decoration: none;
                    color: black;
                    padding-bottom: 10px;

                    &.active {
                        border-bottom: 2px solid #8300BF;
                        color: #8300BF;
                    }

                    &:hover {
                        color: #8300BF;
                    }
                }


            }
        }
        .mobile-navigation-header {
            display: none;
        }

        @media screen and (max-width: 767px) {
            & {
                background: #F7FAFF;
                bottom: 0;
                display: none;
                flex-direction: column;
                left: 0;
                padding: 1em;
                position: fixed;
                right: 0;
                top: 0;
                z-index: 9999;
                &.open {
                    display: flex;
                }
            }
            ul {
                display: flex;
                flex: 1;
                flex-direction: column;
                margin: 0;
                padding: 0;
                li {
                    margin: 1.25em 0;
                }
            }
            .mobile-navigation-header {
                align-items: center;
                display: flex;
                justify-content: space-between;
                margin-bottom: 1em;
            }
        }
    }

    .data-portal-title {
        font-family: "SF Pro Text";
        font-size: 14px;
        color: #303133;
        line-height: 14px;
        position: relative;
        bottom: 5px;
        margin-left: 5px;
        user-select: none;
    }
</style>

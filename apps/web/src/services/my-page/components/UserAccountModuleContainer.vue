<template>
    <p-pane-layout class="user-account-module-container">
        <slot name="headline">
            <div class="headline-wrapper">
                <p class="form-title">
                    {{ props.title }}
                </p>
            </div>
        </slot>
        <slot />
    </p-pane-layout>
</template>

<script setup lang="ts">
import { PPaneLayout } from '@cloudforet/mirinae';

interface Props {
    title?: string
}
const props = withDefaults(defineProps<Props>(), {
    title: '' as string | undefined,
});
</script>

<style lang="postcss" scoped>
.user-account-module-container {
    padding: 1.5rem 1rem;
    .form-title {
        @apply text-display-md;
        margin-bottom: 2rem;
    }
}
</style>

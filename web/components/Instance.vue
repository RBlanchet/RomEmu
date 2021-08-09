<template>
  <div class="instance shadow-lg rounded-lg w-36 p-4 bg-white dark:bg-gray-800 block relative hover:shadow-xl">
    <img class="instance__logo" :src="icon" :alt="name" @click="goToRoute">
    <p class="text-gray-600 font-light dark:text-white text-xl font-medium mb-6">
      {{ name }}
    </p>
    <span
      class="absolute border-2 border-white h-4 ml-2 rounded-full w-4 -top-2 -right-1.5"
      :class="{
          'bg-green-500': status,
          'bg-red-500': !status,
        }"
    ></span>
    <button
      type="button"
      :disabled="!availableToStart"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      :class="{
        'opacity-50': !availableToStart,
        'cursor-not-allowed': !availableToStart
      }"
      @click="$emit('start')"
    >
      Démarrer
    </button>
  </div>
</template>

<script>
export default {
  name: 'Instance',
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    availableToStart: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    goToRoute: function() {
      this.$router.push(this.url);
    }
  },
}
</script>

<style lang="scss">
.instance {
  height: 220px;
  width: 200px;
  text-align: center;
  &__logo {
    width: auto;
    height: 96px;
    padding: 10px;
    display: block;
    margin: auto;
    cursor: pointer;
  }
}
</style>

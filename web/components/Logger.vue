<template>
  <div>
    <div class="fixed top-0 w-full" v-if="modal">
      <div class="h-screen w-full z-10 inset-0 overflow-y-auto">
        <div class="absolute w-full h-full inset-0 bg-gray-500 opacity-75">
        </div>
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            </span>
          <div class="inline-block relative overflow-hidden transform transition-all sm:align-middle" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div>
              <div class="rounded-t-lg bg-white shadow">
                <div class="p-4">
                  <div class="logger bg-gray-800 text-white rounded-lg">
                  <pre class="logger__container">
                    <div class="logger__prompt" v-for="message in messages">
                      <span class="logger__prompt--time">{{ message.time }}</span>
                      <span
                        class="logger__prompt--type"
                        :class="{
                          'logger__prompt--info': message.type === 'info',
                          'logger__prompt--network': message.type === 'network',
                          'logger__prompt--danger': message.type === 'danger',
                          'logger__prompt--error': message.type === 'error',
                        }"
                      >{{ getLabelType(message.type) }}</span>
                      <span class="logger__prompt--message" v-html="message.message"></span>
                    </div>
                  </pre>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="modal = false"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'Logger',
  props: {
    value: {
      type: Boolean,
    },
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
  computed: {
    modal: {
      get: function() {
        return this.value;
      },
      set: function(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    getLabelType: function(type) {
      switch (type) {
        case 'info':
          return 'Informations';
        case 'error':
          return 'Erreur';
        case 'network':
          return 'Network';
        case 'danger':
          return 'Attention';
        //@TODO peuplé les types.
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.logger {
  height: 400px;
  width: 1000px;
  overflow: auto;
  &__prompt {
    display: flex;
    font-size: 12px;
    margin-top: 5px;
    &--type {
      font-size: 14px;
      padding: 0 5px;
    }
    &--info {
      background: #9CA3AF;
    }
    &--network {
      background: #60A5FA;
    }
    &--danger {
      background: #FBBF24;
    }
    &--error {
      background: #F87171;
    }
    span {
      margin-left: 10px;
    }
  }
}
</style>

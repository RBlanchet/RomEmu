<template>
  <div>
    <button
      type="button"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      @click="log = true"
    >
      Afficher logs
    </button>
    <button
      type="button"
      class="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
      @click="$router.push('/auth/sniffer')"
    >
      Afficher le sniffer
    </button>
    <logger v-model="log" title="Auth log" :messages="authLog.map(a => ({time: '', type: a.type, message: a.message}))"/>
  </div>
</template>

<script>
import Logger from "../../components/Logger";
import {mapState} from "vuex";

export default {
  name: 'Auth',
  components: {Logger},
  data: function() {
    return {
      log: false,
      sniffer: false,
    };
  },
  computed: {
    ...mapState({
      authLog: state => state.log.auth,
      status: state => state.instance.status,
    })
  },
  methods: {
    checkIfAuthIsStart: function() {
      if (!this.status.auth) {
        this.$router.push('/');
      }
    }
  },
  watch: {
    status: function() {
      this.checkIfAuthIsStart();
    }
  },
  mounted: function() {
    this.checkIfAuthIsStart();
  }
};
</script>

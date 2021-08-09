<template>
  <div class="sniffer">
    <div class="sniffer__item" v-for="s in sniffer">
      <p>{{ s.packet.message }}</p>
      <pre>{{ s.packet.body }}</pre>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'auth.sniffer',
  computed: {
    ...mapState({
      sniffer: state => state.instance.sniffer,
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
    // this.checkIfAuthIsStart();
  }
};
</script>

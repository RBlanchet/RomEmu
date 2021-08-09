<template>
  <div class="app bg-gray-100">
    <div class="app__container container mx-auto">
      <instance name="API" url="" :status="status.api" icon="https://uploads-ssl.webflow.com/5e8c870f0b8aea69aef19193/609547f6f80f04ff3ba22277_backend_custom_hubspot_integration-p-500.png"/>
      <instance name="Socket" url="" :status="status.socket" icon="https://upload.wikimedia.org/wikipedia/commons/9/96/Socket-io.svg"/>
      <instance
        name="Auth"
        url="/auth"
        :status="status.auth"
        :available-to-start="!status.auth"
        icon="https://play-lh.googleusercontent.com/DwTsGsKrvYPsC-TzKc-3dasiEgIwVOUY5wgTT94XPzcHJP-5V5pvSKZ9v1j1m85OdFfm"
        @start="startServer('auth')"
      />
      <instance
        name="World"
        url=""
        :status="status.world"
        :available-to-start="!status.world"
        icon="https://wiki-dofus.eu/_images/b/b3/Bwak_feu.png"
      />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import Logger from "../components/Logger";
import Instance from "../components/Instance";

export default {
  name: 'index',
  components: {Instance, Logger},
  computed: {
    ...mapState({
      status: state => state.instance.status,
    }),
  },
  methods: {
    startServer: async function(name) {
      try {
        await this.$api.instance.startServer(name);
      } catch (e) {
        alert(`Impossible de démarrer ${name}`);
        console.error(e);
      }
    },
  },
  mounted: async function () {
    this.$nuxtSocket({
      name: 'status',
      reconnection: true,
      teardown: false,
      vuex: {
        mutations: [
          {status: 'instance/UPDATE_STATUS'},
          {auth: 'log/ADD_LOG_AUTH'},
          {sniffer: 'instance/UPDATE_SNIFFER'},
        ],
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
  &__container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
  }
}
</style>

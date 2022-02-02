<template>
  <div data-testId="activation-page">
    <div
      class="alert alert-success mt-3"
      v-if="success"
    >Account is activated</div>
  </div>
  <div
    class="alert alert-danger mt-3"
    v-if="fail"
  >Activation failure</div>
  <Spinner v-if="apiProgress" />

</template>
<script>
import { activate } from "../api/apiCalls";
import Spinner from "../components/Spinner.vue";
export default {
  data() {
    return {
      success: false,
      fail: false,
      apiProgress: false,
    };
  },
  async mounted() {
    this.apiProgress = true;

    try {
      await activate(this.$route.params.token);
      this.success = true;
      this.apiProgress = false;
    } catch (error) {
      this.fail = true;
    }
    this.apiProgress = false;
  },
  components: {
    Spinner,
  },
};
</script>
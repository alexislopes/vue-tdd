<template>
  <div
    data-testId="login-page"
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
  >
    <form
      class="card mt-5"
      data-testid="form-sign-up"
      v-if="!signUpSuccess"
    >
      <div class="card-header">
        <h1 class="text-center">Login</h1>
      </div>

      <div class="card-body">
        <Input
          id="e-mail"
          label="E-mail"
          v-model="email"
        />
        <Input
          type="password"
          id="password"
          label="Password"
          v-model="password"
        />

        <!-- <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit()"
          >
            <Spinner v-if="apiProgress" />

            {{$t('signUp')}}
          </button>
        </div> -->
      </div>
    </form>
  </div>
</template>
<script>
import Input from "../components/Input.vue";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  components: { Input },
};
</script>
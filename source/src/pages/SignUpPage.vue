<template>
  <div
    data-testId="signup-page"
    class="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
  >
    <form
      class="card mt-5"
      data-testid="form-sign-up"
      v-if="!signUpSuccess"
    >
      <div class="card-header">
        <h1 class="text-center">{{$t('signUp')}}</h1>
      </div>

      <div class="card-body">
        <Input
          id="username"
          :label="$t('username')"
          :help="errors.username"
          v-model="username"
        />
        <Input
          id="e-mail"
          :label="$t('email')"
          :help="errors.email"
          v-model="email"
        />
        <Input
          type="password"
          id="password"
          :label="$t('password')"
          :help="errors.password"
          v-model="password"
        />
        <Input
          type="password"
          id="password-repeat"
          :label="$t('passwordRepeat')"
          :help="hasPasswordMismatch ? $t('passwordMismatchValidation') : ''"
          v-model="passwordRepeat"
        />

        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled || apiProgress"
            @click.prevent="submit()"
          >
            <Spinner v-if="apiProgress" />

            {{$t('signUp')}}
          </button>
        </div>
      </div>
    </form>
    <div
      v-else
      class="alert alert-success mt-3"
    >
      {{$t('accountActivationNotification')}}
    </div>
  </div>
</template>

<script>
import Input from "../components/Input.vue";
import Spinner from "../components/Spinner.vue";

import { signUp } from "../api/apiCalls";
export default {
  name: "SignUpPage",
  data() {
    return {
      password: "",
      passwordRepeat: "",
      username: "",
      email: "",
      apiProgress: false,
      signUpSuccess: false,
      errors: {},
    };
  },
  methods: {
    async submit() {
      this.apiProgress = true;
      try {
        await signUp({
          username: this.username,
          email: this.email,
          password: this.password,
        });

        this.signUpSuccess = true;
      } catch (error) {
        if (error.response.status === 400) {
          this.errors = error.response.data.validationErrors;
        }
        this.apiProgress = false;
      }
    },
  },
  computed: {
    isDisabled() {
      return this.password && this.passwordRepeat
        ? this.password != this.passwordRepeat
        : true;
    },

    hasPasswordMismatch() {
      return this.password != this.passwordRepeat;
    },
  },
  watch: {
    username() {
      delete this.errors.username;
    },

    email() {
      delete this.errors.email;
    },

    password() {
      delete this.errors.password;
    },
  },
  components: { Input, Spinner },
};
</script>
<style scoped>
img {
  cursor: pointer;
}
</style>

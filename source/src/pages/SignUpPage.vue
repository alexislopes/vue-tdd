<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
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
            <span
              v-show="apiProgress"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
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

import axios from "axios";
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
    submit() {
      this.apiProgress = true;
      axios
        .post(
          "/api/1.0/users",
          {
            username: this.username,
            email: this.email,
            password: this.password,
          },
          {
            headers: {
              "Accept-Language": this.$i18n.locale,
            },
          }
        )
        .then(() => {
          this.signUpSuccess = true;
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors;
          }
          this.apiProgress = false;
        });
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
  components: { Input },
};
</script>
<style scoped>
img {
  cursor: pointer;
}
</style>

<template>
  <Container width="sm" centered no-padding>
    <Card class="card">
      <h1>{{ t("title") }}</h1>
      <i18n-t keypath="text" tag="p" for="signup_text">
        <NuxtLink to="/signup" data-testid="signup-link">
          {{ t("signup_text") }}
        </NuxtLink>
      </i18n-t>
      <form @submit.prevent="onLogin">
        <Input
          label="E-mail"
          type="email"
          id="email"
          name="email"
          required
          v-model="email"
        />
        <Input
          :label="t('password')"
          type="password"
          id="password"
          name="password"
          required
          password-toggle
          v-model="password"
        />
        <Alert v-if="!!authenticationError" variant="error" class="error">
          <i18n-t keypath="error" tag="span" for="error_signup">
            <NuxtLink to="/signup">{{ t("error_signup") }}</NuxtLink>
          </i18n-t>
        </Alert>
        <Button :loading="loading" size="lg" type="submit">
          {{ t("submit") }}
        </Button>
      </form>
    </Card>
    <footer>
      <a href="/signup">{{ t("signup") }}</a>
      •
      <a href="/reset-password">{{ t("forgot_password") }}</a>
    </footer>
  </Container>
</template>

<script setup>
import Container from "~/components/Container";
import Input from "~/components/Input";
import Card from "~/components/Card";
import {
  AFTER_LOGIN,
  AFTER_LOGIN_RESERVATION_INTENT,
} from "~/components/page-alert/PageAlert.model";

const { t } = useI18n({
  useScope: "local",
});

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { login, isValid } = usePocketbase();

useHead({
  title: `Login`,
});

const email = ref(null);
const password = ref(null);

const loading = ref(false);
const authenticationError = ref(false);

// If the 'return' query parameter is set in the url,
// set the authentication intent
if (route.query.return) {
  userStore.setAuthenticationIntent(null, route.query.return);
}

async function onLogin() {
  authenticationError.value = false;
  loading.value = true;

  try {
    await login(email.value, password.value);
  } catch (e) {
    loading.value = false;
    authenticationError.value = true;
    return;
  }

  if (isValid.value) {
    userStore.login();
    // Show after-login banner on next page
    const { path, intent } = userStore.$state.authenticationIntent;
    if (path) {
      if (intent && intent === "reservation") {
        userStore.showBanner(AFTER_LOGIN_RESERVATION_INTENT);
      } else {
        userStore.showBanner(AFTER_LOGIN);
      }
      router.push(path);
    } else {
      userStore.showBanner(AFTER_LOGIN);
      router.push("/profile");
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~/assets/styles/_breakpoints.scss";

@media (min-width: $breakpoint-md) {
  .card {
    margin-top: 3rem;
  }
  h1 {
    margin-top: -1rem;
  }
}
form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}
form sl-input {
  width: 100%;
}
.error {
  margin: 0;
}
footer {
  width: 100%;
  margin-block: 1rem;
  text-align: center;
  color: var(--body-text-color-light);
  font-size: var(--body-font-sm);
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Log in",
    "text": "No account yet? {0}, to create an account.",
    "signup_text": "Sign up",
    "password": "Password",
    "error": "Log in not successful, please review your account details, or {0} to create an account",
    "error_signup": "sign up",
    "submit": "Log in",
    "signup": "Sign up",
    "forgot_password": "Forgot password?"
  },
  "de": {
    "title": "Einloggen",
    "text": "Noch kein Konto? {0}, um ein Konto zu erstellen.",
    "signup_text": "Registriere dich",
    "password": "Kennwort",
    "error": "Einloggen nicht erfolgreich, bitte überprüfe deine Kontodaten, oder {0} um ein Konto zu erstellen",
    "error_signup": "melde dich an",
    "submit": "Einloggen",
    "signup": "Registrieren",
    "forgot_password": "Passwort vergessen?"
  }
}
</i18n>

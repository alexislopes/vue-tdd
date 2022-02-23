<template>
  <div class="card">
    <div class="card-header text-center">
      <h3>{{$t('users')}}</h3>
    </div>
    <ul class="list-group list-group-flush">

      <li
        class="list-group-item list-group-item-action"
        v-for="user in page.content"
        :key="user.id"
        @click="$router.push(`/user/${user.id}`)"
      >
        <UserListItem :user="user" />
      </li>
    </ul>

    <div class="card-footer text-center">
      <button
        class="btn btn-outline-secondary btn-sm float-start"
        @click="loadData(page.page - 1)"
        v-show="page.page !== 0 && !pendingApiCall"
      > {{$t('previousPage')}}</button>
      <button
        class="btn btn-outline-secondary btn-sm float-end"
        v-show="page.totalPages > page.page + 1 && !pendingApiCall"
        @click="loadData(page.page + 1)"
      >{{$t('nextPage')}} </button>
      <Spinner
        v-show="pendingApiCall"
        size="normal"
      />

    </div>

  </div>
</template>
<script>
import { loadUsers } from "../api/apiCalls";
import UserListItem from "./UserListItem.vue";
import Spinner from "./Spinner";
export default {
  data() {
    return {
      page: {
        content: [],
        page: 0,
        size: 0,
        totalPages: 0,
      },
      pendingApiCall: true,
    };
  },
  methods: {
    async loadData(pageIndex) {
      this.pendingApiCall = true;
      const response = await loadUsers(pageIndex);
      this.page = response.data;
      this.pendingApiCall = false;
    },
  },
  async mounted() {
    try {
      this.loadData(0);
    } catch (error) {
      console.log("🚀 ~ file: UserList.vue ~ line 26 ~ mounted ~ error", error);
    }
  },
  components: { UserListItem, Spinner },
};
</script>

<style scoped>
lt {
  cursor: pointer;
}
</style>
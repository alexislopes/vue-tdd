<template>
  <div class="mb-3">
          <label :for="id" class="form-label">{{label}}</label>
          <input :type="type" :id="id" :value="modelValue" :class="{'is-invalid': help }" class="form-control" @input="$emit('update:modelValue', $event.target.value)"/>
          <span v-if="help" class="invalid-feedback">{{ help }}</span>
        </div>
</template>

<script>
export default {
    emits: ["update:modelValue"],
props: {
    label: String,
    id: String,
    help: String,
    modelValue: String,
    type: String
},
methods: {
    
}
}
</script>

<style>

</style>
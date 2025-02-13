<template>
  <div class="h-screen w-screen flex items-center justify-center bg-[#25282b] text-white">
    <div class="w-full max-h-4xl max-w-4xl p-10 rounded-lg bg-[#274e40] text-center">
      <div class="flex justify-between items-center">
        <button>{{ minute }}:{{ secondValue < 10 ? '0' + secondValue : secondValue }}</button>
        <Button v-if="!isTypingStart" @click="startTest" class="px-7 py-2 rounded-md hover:bg-[#284699] bg-[#1bb952]">
          Start
        </Button>
      </div>
      <h2>{{ rand }}</h2>

      <!-- <h2 v-if="!isTestFinished" class="mt-4 text-lg">{{ randomText }}</h2> -->
      <h2 class="mt-2">Time Left: {{ time }}s | WPM: {{ wordsPerMinute }}</h2>

      <div v-if="!isTestFinished" class="flex flex-wrap justify-center mt-4">
        <span
          v-for="(letter, index) in letters"
          :key="index"
          :class="{
            'text-red-600': letter.style === 'red',
            'text-green-500': letter.style === 'green',
            'text-gray-500': letter.style === 'normal'
          }"
        >
          {{ letter.value !== ' ' ? letter.value : '\u00A0' }}
        </span>
      </div>

      <div v-if="isTestFinished" class="mt-6">
        <h2 class="text-2xl font-bold">Typing Test Completed!</h2>
        <p class="text-lg mt-2">Your WPM: <span class="text-green-400">{{ wordsPerMinute }}</span></p>
        <p class="text-lg">Accuracy: <span class="text-blue-400">{{ accuracy }}%</span></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLetters } from "@/composables/useLetters";

const { letters, setLetters, updateValue } = useLetters();

const randomText = ref("");
const typedKeys = ref("");
const minute = ref(0);
const secondValue = ref(0);
const index = ref(0);
const time = ref(180); 
const isTypingStart = ref(false);
const isTestFinished = ref(false);
const correctCount = ref(0);
const incorrectCount = ref(0);
const timerRunning = ref(false);
const startTime = ref<number | null>(null);
const rand=ref();

const callable=async()=>{
  const response:any=await $fetch("https://hipsum.co/api/?type=hipster-centric&paras=2");
  randomText.value=response[0];
}

const wordsPerMinute = computed(() => {
  if (!startTime.value || time.value === 60) return 0;
  const elapsedMinutes = (60 - time.value) / 60;
  return elapsedMinutes > 0 ? Math.round((correctCount.value / 5) / elapsedMinutes) : 0;
});


const accuracy = computed(() => {
  const totalTyped = correctCount.value + incorrectCount.value;
  return totalTyped > 0 ? ((correctCount.value / totalTyped) * 100).toFixed(2) : 0;
});

onMounted(async() => {
  await callable();
  setLetters(randomText.value);
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

const startTest = () => {
  if (timerRunning.value) return;
  isTypingStart.value = true;
  timerRunning.value = true;
  isTestFinished.value = false;
  typedKeys.value = "";
  correctCount.value = 0;
  incorrectCount.value = 0;
  index.value = 0;
  startTime.value = performance.now();
  time.value = 180;

  const intervalId = setInterval(() => {
    if (time.value <= 0 || index.value >= randomText.value.length) {
      clearInterval(intervalId);
      finishTest();
      return;
    }

    minute.value = Math.floor(time.value / 60);
    secondValue.value = time.value % 60;
    time.value--;
  }, 1000);
};

const finishTest = () => {
  isTestFinished.value = true;
  isTypingStart.value = false;
  timerRunning.value = false;
};


const handleKeyPress = (event: KeyboardEvent) => {
  if (isTestFinished.value || index.value >= randomText.value.length) return;

  if (!timerRunning.value) {
    startTest();
  }

  if (event.key.length === 1) {
    typedKeys.value += event.key;
    checkCorrectness(index.value, event.key);
    index.value++;

    if (index.value >= randomText.value.length) {
      finishTest(); 
    }
  } else if (event.key === "Backspace" && index.value > 0) {
    typedKeys.value = typedKeys.value.slice(0, -1);
    index.value--;
    checkCorrectness(index.value, typedKeys.value[index.value] || "");
  }
};

const checkCorrectness = (i: number, key: string) => {
  if (key === randomText.value[i]) {
    updateValue(i, "green");
    correctCount.value++;
  } else {
    updateValue(i, "red");
    incorrectCount.value++;
  }
};
</script>

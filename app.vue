
<template>
  <div  class="font h-screen w-screen flex flex-row justify-center  bg-[#23333c] text-white">
    <div class="w-11/12 p-20 mx-auto rounded-lg my-auto bg-[#373958]">
      <div class="flex justify-end  ">

        <Button v-if="time>59" @click="timer" class="px-7 py-2 rounded-md hover:bg-[#284699] bg-[#185a3e]">Start</Button>
      </div>
      <h2>Typing {{ time }}</h2>
      <p>{{ randomText }}</p>
      <p>{{ typedKeys }}</p>
      <p>{{ checkCorrectness }} / {{ randomText.length }}</p>

    </div>
  </div>
</template>

<script setup >

const randomText = ref("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos dolorum quas atque pariatur molestias iusto, beatae accusantium eaque mollitia adipisci voluptas quasi facere, minus eum! Modi deleniti laborum officiis sit."); 
const typedKeys = ref("");
const index = ref(0);
const time=ref(60);
const timer=(()=>{


  
  const timeInterval=setInterval(()=>{
    if(time.value==1){
  
    clearInterval(timeInterval);
  }
  time.value--
  },1000);
})
// onMounted(()=>{
//  timer();

// })


const checkCorrectness = computed(() => {
  let correctCount = 0;
  randomText.value.split('').forEach((el, i) => {
    if (typedKeys.value[i] === el) {
      correctCount++;
    }
  });
  return correctCount;
});

const handleKeyPress = (event) => {
  if (/^[a-zA-Z]$/.test(event.key) || event.key===" " && index.value < randomText.value.length) {
    typedKeys.value += event.key;
    index.value++;
  } else if (event.key === "Backspace"  && index.value > 0) {
    typedKeys.value = typedKeys.value.slice(0, -1);
    index.value--;
  }
};
;


onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

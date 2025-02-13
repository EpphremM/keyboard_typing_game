import { ref, watch } from "vue";

export const useLetters = () => {
  const letters = ref<{ value: string; style: string }[]>([]);

  const setLetters = (text: string) => {
    letters.value = text.split("").map((el) => ({
      value: el,
      style: "normal",
    }));
  };

  const updateValue = (index: number, color: string) => {
    if (letters.value[index]) {
      letters.value[index].style = color;
    }
  };

  watch(
    letters,
    (newLetters, oldLetters) => {
      console.log("Old Letters", oldLetters);
      console.log("New Letters", newLetters);
    },
    { deep: true, immediate: true }
  );

  return {
    letters,
    setLetters,
    updateValue,
  };
};

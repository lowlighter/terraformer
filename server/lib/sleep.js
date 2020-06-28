/** Sleep */
  export default function sleep(time) {
    return new Promise(solve => setTimeout(solve, time * 1000))
  }
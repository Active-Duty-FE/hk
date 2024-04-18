export default function onFromSkinQuiz(to, from, next) {
  if (from === '/skin-quiz') {
    console.log(111, from)
  }
  // If the condition is met, allow access to the route
  return next()
}

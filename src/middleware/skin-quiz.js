import { checkAccessSkinQuiz } from '@/utils/guard/skin-quiz'
import { useShowAccessSkinQuiz } from '@/stores/modules/access-skinquiz'

export default async function middlewareSkinQuiz(to, from, next) {
  const { setShowAccessDenyPopup } = useShowAccessSkinQuiz()
  const canAccess = await checkAccessSkinQuiz()
  if (canAccess) return next()
  next({ path: '/' })
  setShowAccessDenyPopup(true)
  return
}

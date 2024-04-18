import { FAQ_OPTIONS } from '@/helpers/constant'

export const CATEGORIES = [
  {
    label: 'All',
    value: '',
    enum: ''
  },
  ...FAQ_OPTIONS
]

export const CONTENTS = [
  {
    id: 1,
    category: 'order-payment',
    title: 'I have not received my E-wallet set up email.',
    description:
      'Because of privacy laws, you will receive an email for your E-wallet registration by the 9th of the following month if commission is due to you.\n' +
      'Please search in your inbox or spam folder for the email from <a href="mailto:rimanus@globalewallet.com">rimanus@globalewallet.com</a>. Make sure you gave your correct email address.'
  },
  {
    id: 2,
    category: 'order-payment',
    title: 'What do I need to set up my E-wallet account?',
    description:
      'We have an E-wallet setup manual in English and Korean.\n' +
      'See the below links:\n' +
      'English: ' +
      '<a href="https://rimanus-my.sharepoint.com/:b:/g/personal/hjcho_riman_com/EfYt1vH9AP1Ii1KboA3a_H4BaeQBGs83BWAITpIWIJxUsA?e=QoGd7g">Link</a>' +
      '\n' +
      'Korean: ' +
      '<a href="https://rimanus-my.sharepoint.com/:b:/g/personal/hjcho_riman_com/EauCBPjoe2RNrm9uMdCW3F8BAWOUEvGfZwXXt_5S9jNSNA?e=hg937B">Link</a>'
  },
  {
    id: 3,
    category: 'order-payment',
    title: 'Can I set up a direct deposit?',
    description: 'Yes, you can. Please see our E-wallet setup manual.'
  },
  {
    id: 4,
    category: 'order-payment',
    title: 'Do I have to change my information for my E-wallet account separately?',
    description: 'Yes'
  },
  {
    id: 5,
    category: 'member-inquiry',
    title: 'How do I change my information?',
    description:
      'Please sign-in to your account.\n' +
      'Go to My Riman -> My Information, click on the Information change button.'
  },
  {
    id: 6,
    category: 'member-inquiry',
    title: 'Do I have to change my info for my E-wallet account separately?',
    description: 'Yes'
  },
  {
    id: 7,
    category: 'member-inquiry',
    title: 'How do I terminate my Planner account?',
    description:
      'Download the Termination Form: ' +
      '<a href="https://www.riman.com/academy/library/gdataroom/list.do">Link</a>' +
      '\n' +
      'Once filled out, email to: <a href="mailto:cs@riman.com">cs@riman.com</a>.\n' +
      'You can enroll again, after 6 months from the date on the Termination Form'
  },
  {
    id: 8,
    category: 'member-inquiry',
    title: 'How do I terminate my customer account?',
    description:
      'Download the Termination Form: ' +
      '<a href="https://www.riman.com/academy/library/gdataroom/list.do">Link</a>' +
      '\n' +
      'Once filled out email to: <a href="mailto:cs@riman.com">cs@riman.com</a>.\n' +
      'You can enroll again, after 6 months from the date on the Termination Form.'
  },
  {
    id: 9,
    category: 'product-inquiry',
    title: 'How do I check my status on Rank Advancement?',
    description:
      'Under My business Status > Position Achievement, you can check the status of BP requirements for each position. Please be careful that not all sales volume will apply to your Position Achievement.\n' +
      'For Team Leader and above, you cannot currently monitor team position achievement requirements at a glance. If you need help monitoring your team position achievement requirement, please contact Customer service.'
  },
  {
    id: 10,
    category: 'points-coupons',
    title: 'Why is my commission showing 0?',
    description:
      'There may be several scenarios of why your commission is showing 0.\n' +
      'You may not have earned any commission from the previous month.\n' +
      'If you have, it may show 0 because you did not meet the Active Customer requirement for the month.\n' +
      'If you click the commission period with $0, you will see the commission details and see that “Own sale,” which means commission earned, you will have a dollar amount. But if “Actual Payment” is showing 0, that means you did not have enough Active Customers to have commissions released.\n' +
      'When a Beauty Customer purchases a product in a calendar month, they will count as a Beauty Customer. You need 3 in a month to qualify you for your commissions.\n' +
      'Lastly, it may show 0 because there may be a commission deduction due to product returns. If the product returns occur after the related commissions have been paid, the company will deduct the amount generated from returned products and deduct from future commissions. You may see the deducted amount at “Deduction total” under the commission detail.'
  },
  {
    id: 11,
    category: 'points-coupons',
    title: 'What happens to my commission if I do not have enough Active Customers?',
    description:
      'Your commission will roll over to the next month until you have your Active Customer requirements.'
  },
  {
    id: 12,
    category: 'member-inquiry',
    title: 'What are Active Customers?',
    description:
      'Active Customer = Beauty Customer who purchases at least 1 product on our website.'
  },
  {
    id: 13,
    category: 'points-coupons',
    title: 'Where can I check my commission?',
    description: 'You can check your commission at, Commission History, once you login.'
  },
  {
    id: 14,
    category: 'points-coupons',
    title: 'How do I convert my position to Planner?',
    description:
      'You can convert your status to Planner by yourself. Here are the steps:\n' +
      '1. Please Sign-in our website\n' +
      '2. Go to My Riman -> My Information\n' +
      '3. Click on the Beauty Planner Conversion button on the Right Screen\n' +
      '4. Read the Beauty Planner Membership Terms and Conditions click on check and click on Beauty Planner Conversion\n' +
      '5. Converted to Beauty Planner'
  },
  {
    id: 15,
    category: 'cancel-refund',
    title: 'What happened to my previous purchases?',
    description:
      'Your previous orders as a customer have already been counted for other people’s BP accumulation, commission calculation, and rank advancement. Therefore, your order history and related BP will not be credited to your Planner account.'
  },
  {
    id: 16,
    category: 'cancel-refund',
    title: 'What is the return policy?',
    description:
      'Beauty Customers may return the products within 30 days from the ordered date.\n' +
      'Beauty Planners may return the products within 60 days from the ordered date.\n' +
      'Beauty Planners who want to terminate (close the business) may return the products within 180 days from the ordered date.\n' +
      'All the returned products must be unopened and undamaged products.\n' +
      'Please check our detailed return policy on our website: ' +
      '<a href="https://www.riman.com/policy/return/page">Link</a>'
  },
  {
    id: 17,
    category: 'cancel-refund',
    title: 'What happens to my commissions if the return happens?',
    description:
      'After completing the inspection of the returned products, we will proceed with commission collection from the E-wallet based on the condition of the returned items. In the event that there is no commission available in the E-wallet, we will proceed with the refund minus the commission.'
  },
  {
    id: 18,
    category: 'cancel-refund',
    title: 'What is the order cancellation policy?',
    description:
      'Same day orders can be canceled before the closing time, which is before 2:59 p.m. PST, but after 2:59 p.m. PST, the orders cannot be canceled and must be returned for cancellation.\n' +
      'You can cancel the same day order directly by pressing the [Cancel Order] button, however, please refer to the information below for more information.\n' +
      '1. My Riman\n' +
      '2. Recent Orders\n' +
      '3. Learn More\n' +
      '4. Scroll down the webpage and Click on the Cancel Order button\n'
  },
  {
    id: 19,
    category: 'points-coupons',
    title: 'What is the compensation for Team Leader?',
    description:
      'For you to receive commission as a Team Leader, you must have a minimum of 10,000 BP in your Team Leader Group in a calendar month. If 10,000 BP is not met, you will be paid as a Senior Manager and the related Team Leader Commission and incentives will be passed on to the Team Leader above.'
  },
  {
    id: 20,
    category: 'autoship-subscription',
    title: 'Where is my tracking number?',
    description: 'Riman.com -> My Riman -> order management -> order history inquiry -> Learn More'
  },
  {
    id: 21,
    category: 'product-inquiry',
    title: 'Can I use a PO box?',
    description: 'You cannot use a PO box.'
  },
  {
    id: 22,
    category: 'event',
    title: 'Is the renewal fee automatically debited from my E-wallet',
    description:
      'For Team Leaders and above, the renewal will be automatically renewed, and the renewal fee will be deducted from your commission at that time.'
  },
  {
    id: 23,
    category: 'etc',
    title: 'Can I add a Global sponsor later?',
    description:
      'The Global Sponsor change is not part of the Riman N.A. program. It is run independently by Korea H.Q. To acquire more accurate and up-to-date information, please contact Korea H.Q. directly.'
  },
  {
    id: 24,
    category: 'autoship-subscription',
    title: 'What is the Global sponsor commission?',
    description:
      'Global Sponsor commission is 5% of the team volume of your sponsored group, once you achieve Team leader and above. It is calculated quarterly. The Global Sponsor system is not part of the Riman N.A. program and it is run independently by Korea H.Q. To acquire more accurate and up-to-date information, please contact Korea H.Q. directly.'
  },
  {
    id: 25,
    category: 'etc',
    title: 'Can I change my sponsor?',
    description:
      'Sponsorships are not permitted to be changed. In the event of an error upon enrollment, RIMAN must be notified within 72 hours (about 3 days) so we can assist.\n' +
      'Those looking to change sponsors would need to submit a letter of resignation and wait 6 months to enroll under a different sponsor.'
  },
  {
    id: 26,
    category: 'etc',
    title: 'Can I change my group to a different line?',
    description:
      'The same applies here, those looking to change teams would need to submit a letter of resignation and wait 6 months to enroll under a different sponsor.'
  },
  {
    id: 27,
    category: 'member-inquiry',
    title: 'What do I need to do to register my business entity?',
    description:
      'Please download the “Business Entity Registration Form” from the “DRIVE” at exploreriman.com.\n' +
      'Once the document is filled out, along with your registration form, please email us the scanned copy (not a photocopy) of the information below.\n' +
      '⦁ Articles of Incorporation (name may vary by states)\n' +
      '⦁ SS-4 (IRS issued EIN number)\n' +
      '⦁ Resale Certificate (if applicable)\n' +
      'The basic information of the Planner account holder and the member of the entity must match in order for us to process your request.\n'
  },
  {
    id: 28,
    category: 'product-inquiry',
    title: 'Can I use resale tax exemptions?',
    description:
      'You may use your resale tax exemptions certificate on your personal orders. Resale tax exemption is intended for you to resell the product that you purchase from us without tax applied, so you may resell the product and file taxes on it through your business.\n' +
      'When you purchase a product as a Customer Order from MyRiman, we acknowledge that the order has already been sold to a customer and we will file and collect necessary taxes related to the sale.'
  },
  {
    id: 29,
    category: 'autoship-subscription',
    title: 'Can I add two people to my Planner account?',
    description:
      'If you are married or able to provide a legal document that states your partnership, you may add a second person on your account. However, if one of the individuals decides to forego the partnership for any reason, the person withdrawing may not enroll for 180 days.'
  },
  {
    id: 30,
    category: 'event',
    title: 'Are we FDA approved?',
    description:
      'Thank you for your questions.\n' +
      '\n' +
      'Please note that while the FDA does regulate cosmetics, it does NOT administer approvals for cosmetics to go on the market. The FDA regulates cosmetics via two laws, the Federal Food, Drug, and Cosmetic Act (FD&C) and the Fair Packaging and Labeling Act (FPLA). These acts prohibit the marketing of misbranded or falsely labeled cosmetics, but manufacturers and brand marketers, not the FDA, have the ultimate responsibility of ensuring the safety of their own products (read more about the FDA’s involvement in cosmetics here.)\n' +
      'To embrace our moral responsibility of ensuring the safety and marketing validity of each of our products, we submit each formula to high standards and testing before sale. RIMAN products are manufactured at an FDA-approved facility that carries GMP (good manufacturing practice) and OTC (over-the-counter) certifications and upholds stringent quality and organizational assurances. All RIMAN products and ingredients are selected and used based on a comprehensive review of global regulations, compliance, and safety data. Ingredients are selected on not only the basis of efficacy, but also on the bases of environmental responsibility and skin safety.\n' +
      'For example, our Dermatology EX line is German Derma tested, which means it is guaranteed safe for sensitive skin with no potential for skin irritation.  We have also tested our Suamel body care items, which were confirmed not to cause irritation, and our Deserticola hair products for cytotoxicity, of which none was found. As we continue to innovate, safety and quality remain at the forefront of formulation, so these tests are only some of the many we perform before bringing the RIMAN difference to you!\n' +
      'We hope this helps alleviate your concerns. We are here to help 😊'
  }
]

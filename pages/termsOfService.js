import { useRouter } from 'next/router';
import React, { memo } from 'react';
import LayoutPage from '../components/layouts/layoutPage';
import LayoutScreen from '../components/layouts/layoutScreen';


const TermsOfService = () => {

  const router = useRouter();

  const onClose = () => {
    router.push('/', undefined, { shallow: true })
  }

  return (
    <LayoutPage>
      <LayoutScreen title='Terms of Service' description='Klik'>
        <section className='container'>
          <div className="color-b" style={{ fontSize: 16 }}>
            1.	Salt Holdings, Inc. d/b/a Klik ("Klik," "we", "us", or "our") is committed to protecting your privacy. We have prepared this Privacy Policy to describe to you our practices regarding the information we collect, use, and share in connection with the Klik websites, mobile apps, and other services we provide to you (collectively, the "Service").
            <br /><br />
            2.	Types of Information We Collect. We collect information about our users, which may be identifiable, pseudonymous, or anonymous (including aggregated and de-identified data), as described below.
            <br /><br />
            3.	Information you provide to us. When you use our Service, you can add information to your account. We collect information and other data you add to your account, such as email address, username, linked social media accounts, favorited items and watchlisted collections, and other information you provide. Your Account Information will be publicly visible. Remember public content can exist elsewhere on the internet even after you remove it from your account on Klik.
            <br />
            <ol style={{ listStyleType: 'lower-alpha' }}>
              <li> Preferences.  Our Service lets you store preferences like how your content is displayed, notification settings, and favorites. We may associate these choices with your account, browser, and/or mobile device.</li>
              <li> Feedback. If you provide us with feedback or contact us, we may receive your name and contact information (such as an email address), as well as any other content included in or associated with the message you send.</li>
              <li> User-generated content, including comments, photographs, livestreams, audio recordings, videos, text, hashtags, and virtual item videos that you choose to create with or upload to the Klik (“User Content”) and the associated metadata, such as when, where, and by whom the content was created. Even if you are not a user, information about you may appear in User Content created or published by users on the Klik. When you create User Content, we may upload or import it to the Klik before you save or post the User Content (also known as pre-uploading), for example, in order to recommend audio options, generate captions, and provide other personalized recommendations. If you apply an effect to your User Content, we may collect a version of your User Content that does not include the effect.</li>
              <li> Messages, which include information you provide when you compose, send, or receive messages through the Metasalt’s messaging functionalities. They include messages you send through our chat functionality when communicating with merchants who sell goods to you, and your use of virtual assistants when purchasing items through the Klik. That information includes the content of the message and information about the message, such as when it was sent, received, or read, and message participants. Please be aware that messages you choose to send to other users of the Klik will be accessible by those users and that we are not responsible for the manner in which those users use or share the messages.</li>
              <li> Information, including text, images, and videos, found in your device’s clipboard, with your permission. For example, if you choose to initiate information sharing with a third-party Klik, or choose to paste content from the clipboard onto the Klik, we access this information stored in your clipboard in order to fulfill your request.</li>
              <li> Purchase information, including payment card numbers or other third-party payment information (such as PayPal) where required for the purpose of payment, and billing and shipping address. We also collect information that is required for extended warranty purposes and your transaction and purchase history on or through the Klik.</li>
              <li> Your phone and social network contacts, with your permission. If you choose to find other users through your phone contacts, we will access and collect information such as names, phone numbers, and email addresses, and match that information against existing users of the Klik. If you choose to find other users through your social network contacts, we will collect your public profile information as well as names and profiles of your social network contacts.</li>
              <li> Your choices and communication preferences.</li>
              <li> Information to verify an account such as proof of identity or age.</li>
              <li> Information in correspondence you send to us, including when you contact us for support.</li>
              <li> Information you share through surveys or your participation in challenges, research, promotions, marketing campaigns, events, or contests such as your gender, age, likeness, and preferences.</li>
              <li> Other Information. We also collect information and other data at other points in our Service where you voluntarily provide it or where we state that your information is being collected.</li>
              <li> Additionally, we rely on 3rd party services such as Web3auth to enable quick and easy wallet creation using your social accounts such as Facebook, Twitter, Google, Discord, Instagram, Apple ID, and any other OAuth providers.  Our list of social authorization logins to create your wallet using 3rd party software such as Web3Auth continues to grow and the list above is not exhaustive. If you choose to sign-up or log-in to Klik using a third-party service such as Facebook, Twitter, Instagram, or Google, or link your Klik account to a third-party service, we may collect information from the service–for example, your public profile information (such as nickname), email, and contact list. Social authorized logins, such as through your Twitter Profile inherently contain identifying information used to create your wallet that may be passed onto us, such as your Twitter handle or email address.  Your blockchain wallet address functions as your identity on Klik but not the only way to identify you.</li>
              <li> You will need a blockchain wallet address and a third-party wallet to access certain aspects of the Service. We do not consider a blockchain wallet address, standing alone, to be information that identifies you. However, a blockchain wallet address may become associated with you or information you provide when you use our Service.</li>
            </ol>

            <br />
            4.	Information Collected Automatically. As you navigate through and interact with our Service, we may use automatic data collection technologies to collect certain information, including:
            <br />
            <ol style={{ listStyleType: 'lower-alpha' }}>
              <li>	Interactions with our Service. To provide our Service, analyze trends, enforce our Terms of Service, and make the Service more useful to you, we collect information from you when you interact with our Service, including, but not limited to, your browser type or fingerprint, operating system, IP address and associated geolocation, device ID, blockchain wallet address, wallet type, actions and clickstream data, referring/exit pages, and date/time stamps. We may also store this data in log files.</li>
              <li>	Cookies or Other Tracking Technologies. Like many online services, we use cookies to collect information. We may use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your computer until you delete them) to analyze how users interact with our Service, make improvements to our product quality, and provide users with a more personalized experience. In addition, we use "Pixel Tags" (also referred to as clear Gifs, Web beacons, or Web bugs). Pixel Tags allow us to analyze how users find our Service, make the Service more useful to you, and tailor your experience with us to meet your particular interests and needs.</li>
              <li>	Do Not Track. As there is no common understanding about what a "Do Not Track" signal is supposed to mean, we don’t respond to those signals in any particular way. See further information below regarding how you may be able to withdraw your consent for the use of certain tracking technologies like cookies and pixel tags. You may also contact us here.</li>
              <li>	Advertisers, measurement and other partners share information with us about you and the actions you have taken outside of the Klik, such as your activities on other websites and apps or in stores, including the products or services you purchased, online or in person. These partners also share information with us, such as mobile identifiers for advertising, hashed email addresses and phone numbers, and cookie identifiers, which we use to help match you and your actions outside of the Klik with your Klik account. Some of our advertisers and other partners enable us to collect similar information directly from their websites or apps by integrating our Klik Advertiser Tools.</li>
              <li>	We may obtain information about you from certain affiliated entities within our corporate group, including about your activities on their Klik accounts.</li>
              <li>	We may receive information about you from others, including where you are included or mentioned in User Content, direct messages, in a complaint, appeal, request or feedback submitted to us, or if your contact information is provided to us. We may collect information about you from other publicly available sources.</li>
            </ol>
            <br />
            5.	We engage with third-party services ("Third Party Services"), including Google and Amplitude, to help collect some of the information referred to above. These Third-Party Services, acting on our behalf, may collect information about your use of our Service through their own cookies, Pixel Tags, or other technologies ("Analytics Information"). The Third-Party Services’ ability to use and share Analytics Information is restricted by such Third-Party Services’ terms of use and privacy policy.
            <br /><br />

            6.	Information Collected from Third-Party Companies. We may receive information about you or related to you or your wallet address from service providers and other sources/companies that offer their products and/or services to us or to you, for use in conjunction with our Service, or whose products and/or services may be linked from our Service. We may add this to the data we have already collected from or about you through our Service. This information may include, for example: third-party wallet providers that provide us with your blockchain wallet address and certain other information you choose to share with those wallet providers; data analytics providers or vendors who provide us information related to certain blockchain wallet addresses;
            vendors who provide communication and identity verification services to us and which you choose to use; and other vendors who provide us information necessary to run our business or enforce our Terms of Service.
            <br /><br />

            7.	Advertisers, measurement and other partners share information with us about you and the actions you have taken outside of the Klik, such as your activities on other websites and apps or in stores, including the products or services you purchased, online or in person. These partners also share information with us, such as mobile identifiers for advertising, hashed email addresses and phone numbers, and cookie identifiers, which we use to help match you and your actions outside of the Klik with your Klik account. Some of our advertisers and other partners enable us to collect similar information directly from their websites or apps by integrating our Klik Advertiser Tools.
            <br /><br />

            8.	We may obtain information about you from certain affiliated entities within our corporate group, including about your activities on their Klik.
            <br /><br />

            9.	We may receive information about you from others, including where you are included or mentioned in User Content, direct messages, in a complaint, appeal, request or feedback submitted to us, or if your contact information is provided to us. We may collect information about you from other publicly available sources.
            <br /><br />

            10.	Public Information. We collect data from activity and information that is publicly visible and/or accessible on blockchains or other public sources. This may include, for example, blockchain wallet addresses and information regarding purchases, sales, or transfers of NFTs, which may then be associated with other data you have provided to us.
            <br /><br />

            11.	Use of Your Information. As explained below, we use your information to improve, support and administer the Klik, to allow you to use its functionalities, and to fulfill and enforce our Terms of Service. We may also use your information to, among other things, show you suggestions, promote the Platform, and customize your ad experience.
            <div style={{ marginLeft: 12 }}>a.	We process information about and/or related to you to run our business, provide the Service, personalize your experience on the Service, and improve the Service. Specifically, we use your information to:</div>
            <ol style={{ listStyleType: 'lower-roman', marginLeft: 30 }}>
              <li>	improve and analyze the Service;</li>
              <li>	analyze, improve, and personalize your use and experience on the Service, including by making recommendations to you;</li>
              <li>	communicate with you;</li>
              <li>	investigate, address, and prevent conduct that may violate our Terms of Service and/or that is otherwise harmful or unlawful;</li>
              <li> send you newsletters, promotional materials, and other notices related to our Service or third parties’ goods and services;</li>
              <li>	to fulfill requests for products, services, Klik functionality, support and information for internal operations, including troubleshooting, data analysis, testing, research, statistical, and survey purposes and to solicit your feedback.</li>
              <li>	to customize the content you see when you use the Klik. For example, we may provide you with services based on the country settings you have chosen or show you content that is similar to content that you have liked or interacted with.</li>
              <li>	to send promotional materials from us or on behalf of our affiliates and trusted third parties.</li>
              <li>	to improve and develop our Klik and conduct product development.</li>
              <li>	to measure and understand the effectiveness of the advertisements we serve to you and others and to deliver advertising, including targeted advertising, to you on Klik.</li>
              <li>	to make suggestions and provide a customized ad experience.</li>
              <li>	to support the social functions of Klik, including to permit you and others to connect with each other (for example, through our Find Friends function), to suggest accounts to you and others, and for you and others to share, download, and otherwise interact with User Content posted through Klik.</li>
              <li>	to use User Content as part of our advertising and marketing campaigns to promote Klik.</li>
              <li>	to understand how you use Klik, including across your devices.</li>
              <li>	to infer additional information about you, such as your age, gender, and interests.</li>
              <li>	to help us detect abuse, fraud, and illegal activity on Klik.</li>
              <li>	to promote the safety and security of Klik, including by scanning, analyzing, and reviewing User Content, messages and associated metadata for violations of our Terms of Service, Community Guidelines, or other conditions and policies.</li>
              <li>	to verify your identity in order to use certain features, such as livestream or verified accounts, or when you apply for a Pro Account, to ensure that you are old enough to use Klik (as required by law), or in other instances where verification may be required.</li>
              <li>	to communicate with you, including to notify you about changes in our services.</li>
              <li>	to announce you as a winner of our contests or promotions if permitted by the promotion rule, and to send you any applicable prizes.</li>
              <li>	to enforce our Terms of Service, Community Guidelines, and other conditions and policies.</li>
              <li>	consistent with your permissions, to provide you with location-based services, such as advertising and other personalized content.</li>
              <div style={{ marginLeft: 25 }}>1.	to train and improve our technology, such as our machine learning models and algorithms.</div>
              <div style={{ marginLeft: 25 }}>2.	To combine all the information we collect or receive about you for any of the foregoing purposes.</div>
              <li>	to facilitate sales, promotion, and purchases of goods and services and to provide user support.</li>
              <li>	for any other purposes disclosed to you at the time we collect your information or pursuant to your consent.</li>
              <li>	comply with applicable laws, cooperate with investigations by law enforcement or other authorities of suspected violations of law, and/or to protect our and our Affiliates’ legal rights; and</li>
              <li>	act in any other way which we have communicated to you and to which you have consented or we may describe when you provide your information.</li>
            </ol>
            <br />

            12.	We may create anonymized records from identifiable information. We use this data for the same purposes as outlined above, including to improve our Service. We reserve the right to use and/or disclose anonymized information for any purpose.
            <br /><br />

            13.	Disclosure of Your Information. We disclose your information and information about you as described below:
            <ol style={{ listStyleType: 'lower-alpha' }}>
              <li>	Third Party Service Providers. We may share your information and information about you with third party service providers to: provide technical infrastructure services; conduct quality assurance testing; analyze how our Service is used; prevent, detect, and respond to unauthorized activities or potential violations of our Terms of Service or policies; provide technical and customer support; and/or to provide other support to you, us, and/or to the Service.</li>
              <li>	Affiliates. We may share some or all of your information and information about you with any subsidiaries, joint ventures, or other companies or products under our common control ("Affiliates"), in which case we will require our Affiliates to honor this Privacy Policy, such as our 3rd party payment processors such as, but not limited to Wert, Inc.</li>
              <li>	Information Related to Your Public Activity. We may display or share information relating to your public activity on blockchains, Klik, and/or Klik Pro. For example, we use technology like APIs to make certain information like your blockchain activity available to websites, apps, and others for their use.</li>
              <li>	Corporate Restructuring. We may share some or all of your information and information about you in connection with or during negotiation of any merger, financing, acquisition, or dissolution transaction or proceeding involving a sale, transfer, or divestiture of all or a portion of our business or assets. In the event of an insolvency, bankruptcy, or receivership, your information and information about you may also be transferred as a business asset. If another company acquires our company, business, or assets, that company will possess the information collected by us and will assume the rights and obligations regarding your information and information about you as described in this Privacy Policy.</li>
            </ol>
            <br />

            14.	Legal Rights. Regardless of any choices you make regarding your information (as described below), Klik may disclose your information and information about you if it believes in good faith that such disclosure is necessary: (a) in connection with any legal investigation; (b) to comply with relevant laws or to respond to subpoenas, warrants, or other legal process served on Klik; (c) to protect or defend the rights or property of Klik or users of the Service; and/or (d) to investigate or assist in preventing any violation or potential violation of the law, this Privacy Policy, or our Terms of Service.
            <br /><br />

            15.	Other Disclosures. We may also disclose your information and information about you: to fulfill the purpose for which you provide it, including to provide you with our Service and new features; for any other purpose disclosed by us when you provide it; or with your consent.
            <br /><br />

            16.	Third-Party Websites. Our Service may contain links to third-party websites. When you click on a link to any other website or location, you will leave our Service and go to another site, and another entity may collect information from you. We have no control over and cannot be responsible for these third-party websites or their content. Please be aware that this Privacy Policy does not apply to these third-party websites or their content, or to any collection of your information or information about you after you click on links to such third-party websites. We encourage you to read the privacy policies of every website you visit. Any links to third-party websites or locations are for your convenience and do not signify our endorsement of such third parties or their products, content, or websites.
            <br /><br />

            17.	Third-Party Wallets. To use certain aspects of our Service, you must use a third-party wallet such as Metamask, which allows you to engage in transactions on public blockchains. Your interactions with any third-party wallet provider are governed by the applicable terms of service and privacy policy of that third party.
            <br /><br />

            18.	Your Choices Regarding Information. You have choices regarding the use of information on our Service:
            <ol style={{ listStyleType: 'lower-alpha' }}>
              <li>	Email Communications. We may periodically send you newsletters and/or emails that directly promote the use of our Service or third parties’ goods and services. When you receive email communications from us, you may indicate a preference to stop receiving these communications from us by following the unsubscribe instructions provided in the email you receive or through the Notifications preferences in your Settings page. Despite these preferences, we may send you occasional transactional service-related informational communications.</li>
              <li> Cookies. If you decide at any time that you no longer wish to accept cookies from our Service for any of the purposes described above, you can change your browser settings to stop accepting cookies or to prompt you before accepting a cookie from the websites you visit. Consult your browser’s technical information to learn more. If you do not accept cookies, however, you may not be able to use all portions of the Service or all functionality of the Service.</li>
              <li> Data Access and Control. You can view, access, edit, or delete your information and information about you for certain aspects of the Service via your Settings page. Depending on applicable law where you reside, you may be able to assert certain rights related to your information and information about you. If such rights are not provided under law for your operating entity or jurisdiction, Klik has full discretion in fulfilling your request.</li>
            </ol>
            <br />

            19.	If you are a user in the European Economic Area ("EEA"), United Kingdom ("UK") or Switzerland, you have certain rights under applicable law. These include the right to (i) request access and obtain a copy of your personal information; (ii) request rectification or erasure of your personal information; (iii) object to or restrict the processing of your personal information; and (iv) request portability of your personal information. Additionally, if we have collected and processed your personal information with your consent, you have the right to withdraw your consent at any time.
            <br /><br />

            20.	If you are a California resident, you have certain rights under the California Privacy Rights Act ("CPRA"). These include the right to (i) request access to, details regarding, and a copy of the personal information we have collected about you and/or shared with third parties; (ii) request deletion of the personal information that we have collected about you; and (iii) the right to opt-out of sale of your personal information. As the terms are defined under the CPRA, we do not "sell" your "personal information."
            <br /><br />

            21.	If you wish to exercise your rights under an applicable data protection or privacy law, please contact us by using the “Submit a request” link here or at the address provided in Section 15 below, specify your request, and reference the applicable law. We may ask you to verify your identity, or ask for more information about your request. We will consider and act upon any above request in accordance with applicable law. We will not discriminate against you for exercising any of these rights.
            <br /><br />

            22.	If you believe that we have infringed your rights, we encourage you to first contact us by using the “Submit a request” link here so that we can try to resolve the issue or dispute informally.
            <br /><br />

            23.	Data Retention. We may continue to retain your information or information about you even after you request deletion of your data if such retention is reasonably necessary to comply with our legal obligations, to resolve disputes, prevent fraud and abuse, enforce our Terms or other agreements, and/or protect our legal rights and other interests.
            <br /><br />

            24.	Security. We care about the security of your information and use physical, administrative, and technological safeguards to preserve the integrity and security of information collected through our Service. However, no security system is impenetrable and we cannot guarantee the security of our systems, or those of our vendors. In the event that any information under our custody and control is compromised as a result of a breach of our security, we will take steps to investigate and remediate the situation and, in accordance with applicable laws and regulations, may notify those individuals whose information may have been compromised.
            <br /><br />

            25.	You are responsible for the security of your digital wallet, and we urge you to take steps to ensure it is and remains secure. If you discover an issue related to your wallet, please contact your wallet provider.
            <br /><br />

            26.	Minors. We do not intentionally gather information from visitors who are under the age of 13. Our Terms of Service require all users to be at least 18 years old. Minors who are at least 13 years old but are under 18 years old may use a parent or guardian’s account, but only with the supervision of the account holder. If a child under 13 submits identifiable information to us and we learn that the identifiable information is the information of a child under 13, we will attempt to delete the information as soon as possible. If you believe that we might have any identifiable information from a child under 13, please contact us by using the “Submit a request” link here or at the address indicated in Section 15 below.
            <br /><br />

            27.	Users Outside of the United States. If you are a non-U.S. user of the Service, by visiting the Service and providing us with information directly or indirectly, you understand and acknowledge that your information and information about you may be processed in the country in which it was collected and in other countries, including the United States, where laws regarding processing of your information or information about you may be less stringent than the laws in your country.
            <br /><br />

            28.	For users in EEA, UK and Switzerland. Legal Bases for Processing Personal Data. When you access or use the Service, we collect, use, share, and otherwise process your personal data for the purposes described in this Privacy Policy. We rely on a number of legal bases to use your information in these ways.
            <ol style={{ listStyleType: 'lower-alpha' }}>

              <li>	We process your personal data with your consent, for example, to: communicate with you; send you marketing emails and/or notifications; and for any other purpose that we communicate to you and to which you have consented.</li>
              <li>	We process your personal data in order to fulfill our contract with you and to provide you with our Service, for example, to: provide, operate and maintain the Service; and investigate, address, and prevent conduct that may violate our Terms of Service.</li>
              <li>	We process your personal data pursuant to legitimate interests, for example, to: improve and analyze the Service; and personalize your experience on the Service.</li>
              <li>	We process your personal data in order to comply with legal obligations, in the public interest, or in your vital interests, for example, to: detect, prevent, and address activities that we consider could be fraudulent, violations of our Terms of Service or policies, and/or otherwise harmful or unlawful.</li>
              <li>	We will use appropriate safeguards for transferring your personal data out of the EEA, UK and Switzerland where required and only transfer such personal data under a legally valid transfer mechanism.</li>
            </ol>
            <br />

            29.	Changes to This Privacy Policy. This Privacy Policy may be updated from time to time for any reason. We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy at https://Klik.io/privacy. The date the Privacy Policy was last revised is identified at the beginning of this Privacy Policy. You are responsible for periodically visiting our Service and this Privacy Policy to check for any changes.
            <br /><br />

            30.	California Privacy Rights Disclosure.
            <ol style={{ listStyleType: 'lower-alpha' }}>

              <li>	The categories of personal information we collect about users, as described above in Section 1, include: (1) identifiers, (2) commercial information, (3) internet or online identifiers, (4) geolocation data, and (5) information derived from other personal information about you.</li>
              <li>	The categories of sources from which the personal information is collected are described above in Section 1.</li>
              <li>	The business or commercial purpose for collecting personal information are described above in Sections 2 and 3.</li>
              <div style={{ marginLeft: 30 }}>	i. The categories of personal information we share with third parties, as described above in Section 3, include: (1) identifiers, (2) commercial information, (3) internet or online identifiers, (4) geolocation data, and (5) information derived from other personal information about you.</div>
            </ol>
            <br />

            31.	Questions; Contacting Us; Reporting Violations. If you have any questions or concerns or complaints about our Privacy Policy or our data collection or processing practices, or if you want to report any security violations to us, please contact us by using the “Submit a request” link here or at the following address: 160 Varick Street, Third Floor, New York, NY 10013.

          </div>

          <div className="row justify-content-center mt-5">

            <div className="offer-btn" onClick={onClose} style={{ width: 200, marginRight: 20 }}>
              I disagree
            </div>

            <div
              className={'offer-btn buy-btn'}
              onClick={onClose}
              style={{ width: 200 }}
            >
              I agree
            </div>
          </div>
        </section>
      </LayoutScreen>
    </LayoutPage>
  )
};

export default memo(TermsOfService);
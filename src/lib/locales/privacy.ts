import { Locale } from "@/hooks/useLocale";

export interface PrivacySection {
  heading: string;
  body: string;
  items?: string[];
}

export interface PrivacyContent {
  title: string;
  updated: string;
  sections: PrivacySection[];
}

export const PRIVACY: Record<Locale, PrivacyContent> = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: April 27, 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        body: "We collect information you provide directly to us, including:",
        items: [
          "Account data: name, company name, email address, and password when you register",
          "Assessment data: your answers to the BRITE diagnostic questionnaire, scores, and quadrant classifications",
          "Usage data: pages visited, features used, timestamps, and browser/device information",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        body: "We use collected information to:",
        items: [
          "Provide, operate, and improve the BRITE Advisor Service",
          "Generate and store AI-powered architecture diagnoses",
          "Display aggregated analytics on the Analytics Dashboard",
          "Send transactional emails (account confirmation, password reset)",
          "Respond to your support requests",
          "Monitor for abuse and ensure security of the Service",
        ],
      },
      {
        heading: "3. Data Sharing",
        body: "We do not sell your personal data. We may share data with:",
        items: [
          "Service providers: third-party vendors who help us operate the Service (hosting, analytics, email delivery) under strict data processing agreements",
          "AI providers: assessment inputs are sent to Google Gemini to generate diagnoses; data is processed per Google's API data policies",
          "Legal requirements: when required by law, subpoena, or to protect our rights",
        ],
      },
      {
        heading: "4. Analytics Dashboard",
        body: "Aggregated, anonymized assessment data (company name, quadrant, scores) may appear in the public Analytics Dashboard. If you prefer your assessment not to appear, contact us and we will remove it from public views.",
      },
      {
        heading: "5. Data Retention",
        body: "We retain your account and assessment data for as long as your account is active. You may request deletion of your data at any time by contacting us. Anonymized, aggregated analytics data may be retained indefinitely.",
      },
      {
        heading: "6. Cookies and Tracking",
        body: "We use essential cookies to maintain your session and preferences. We do not use advertising or third-party tracking cookies. You may disable cookies in your browser settings, but some features of the Service may not function correctly.",
      },
      {
        heading: "7. Security",
        body: "We implement industry-standard security measures including encrypted data transmission (HTTPS), hashed password storage, and access controls. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.",
      },
      {
        heading: "8. Your Rights",
        body: "Depending on your jurisdiction, you may have the right to:",
        items: [
          "Access the personal data we hold about you",
          "Correct inaccurate data",
          "Request deletion of your data",
          "Object to or restrict certain processing",
          "Data portability (receive your data in a structured format)",
        ],
      },
      {
        heading: "9. Children's Privacy",
        body: "The Service is not directed to individuals under 16. We do not knowingly collect personal data from children. If you believe a child has provided us personal data, contact us and we will delete it.",
      },
      {
        heading: "10. Changes to This Policy",
        body: "We may update this Privacy Policy periodically. We will notify registered users of material changes. Continued use of the Service after changes constitutes acceptance of the updated Policy.",
      },
      {
        heading: "11. Contact",
        body: "Privacy questions or concerns? Contact us at privacy@briteadvisor.com.",
      },
    ],
  },

  pt: {
    title: "Política de Privacidade",
    updated: "Última atualização: 27 de abril de 2026",
    sections: [
      {
        heading: "1. Informações que Recolhemos",
        body: "Recolhemos informações que nos fornece diretamente, incluindo:",
        items: [
          "Dados de conta: nome, nome da empresa, endereço de e-mail e senha ao registar-se",
          "Dados de avaliação: as suas respostas ao questionário de diagnóstico BRITE, pontuações e classificações de quadrante",
          "Dados de utilização: páginas visitadas, funcionalidades utilizadas, timestamps e informações do browser/dispositivo",
        ],
      },
      {
        heading: "2. Como Utilizamos as Suas Informações",
        body: "Utilizamos as informações recolhidas para:",
        items: [
          "Fornecer, operar e melhorar o Serviço BRITE Advisor",
          "Gerar e armazenar diagnósticos de arquitetura baseados em IA",
          "Mostrar análises agregadas no Painel de Análise",
          "Enviar e-mails transacionais (confirmação de conta, redefinição de senha)",
          "Responder aos seus pedidos de suporte",
          "Monitorizar abusos e garantir a segurança do Serviço",
        ],
      },
      {
        heading: "3. Partilha de Dados",
        body: "Não vendemos os seus dados pessoais. Podemos partilhar dados com:",
        items: [
          "Fornecedores de serviços: prestadores terceiros que nos ajudam a operar o Serviço (alojamento, análise, entrega de e-mail) ao abrigo de acordos rigorosos de processamento de dados",
          "Fornecedores de IA: as entradas de avaliação são enviadas ao Google Gemini para gerar diagnósticos; os dados são tratados de acordo com as políticas de dados da API do Google",
          "Requisitos legais: quando exigido por lei, intimação ou para proteger os nossos direitos",
        ],
      },
      {
        heading: "4. Painel de Análise",
        body: "Dados de avaliação agregados e anonimizados (nome da empresa, quadrante, pontuações) podem aparecer no Painel de Análise público. Se preferir que a sua avaliação não apareça, contacte-nos e removeremos das visualizações públicas.",
      },
      {
        heading: "5. Retenção de Dados",
        body: "Mantemos os seus dados de conta e avaliação enquanto a sua conta estiver ativa. Pode solicitar a eliminação dos seus dados em qualquer momento através de contacto connosco. Dados de análise anonimizados e agregados podem ser mantidos indefinidamente.",
      },
      {
        heading: "6. Cookies e Rastreamento",
        body: "Utilizamos cookies essenciais para manter a sua sessão e preferências. Não utilizamos cookies de publicidade ou rastreamento de terceiros. Pode desativar cookies nas definições do seu browser, mas algumas funcionalidades do Serviço podem não funcionar corretamente.",
      },
      {
        heading: "7. Segurança",
        body: "Implementamos medidas de segurança padrão da indústria, incluindo transmissão de dados cifrada (HTTPS), armazenamento de senhas com hash e controlos de acesso. Nenhum método de transmissão pela internet é 100% seguro; não podemos garantir segurança absoluta.",
      },
      {
        heading: "8. Os Seus Direitos",
        body: "Dependendo da sua jurisdição, pode ter o direito de:",
        items: [
          "Aceder aos dados pessoais que detemos sobre si",
          "Corrigir dados inexatos",
          "Solicitar a eliminação dos seus dados",
          "Opor-se ou restringir determinado processamento",
          "Portabilidade de dados (receber os seus dados num formato estruturado)",
        ],
      },
      {
        heading: "9. Privacidade de Menores",
        body: "O Serviço não é dirigido a menores de 16 anos. Não recolhemos conscientemente dados pessoais de crianças. Se acreditar que uma criança nos forneceu dados pessoais, contacte-nos e eliminaremos esses dados.",
      },
      {
        heading: "10. Alterações a Esta Política",
        body: "Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos os utilizadores registados sobre alterações materiais. O uso continuado do Serviço após as alterações constitui aceitação da Política atualizada.",
      },
      {
        heading: "11. Contacto",
        body: "Dúvidas ou preocupações sobre privacidade? Contacte-nos em privacy@briteadvisor.com.",
      },
    ],
  },

  es: {
    title: "Política de Privacidad",
    updated: "Última actualización: 27 de abril de 2026",
    sections: [
      {
        heading: "1. Información que Recopilamos",
        body: "Recopilamos información que usted nos proporciona directamente, incluyendo:",
        items: [
          "Datos de cuenta: nombre, nombre de empresa, correo electrónico y contraseña al registrarse",
          "Datos de evaluación: sus respuestas al cuestionario de diagnóstico BRITE, puntuaciones y clasificaciones de cuadrante",
          "Datos de uso: páginas visitadas, funciones utilizadas, marcas de tiempo e información del navegador/dispositivo",
        ],
      },
      {
        heading: "2. Cómo Usamos su Información",
        body: "Usamos la información recopilada para:",
        items: [
          "Proporcionar, operar y mejorar el Servicio BRITE Advisor",
          "Generar y almacenar diagnósticos de arquitectura impulsados por IA",
          "Mostrar análisis agregados en el Panel de Análisis",
          "Enviar correos electrónicos transaccionales (confirmación de cuenta, restablecimiento de contraseña)",
          "Responder a sus solicitudes de soporte",
          "Monitorear abusos y garantizar la seguridad del Servicio",
        ],
      },
      {
        heading: "3. Compartición de Datos",
        body: "No vendemos sus datos personales. Podemos compartir datos con:",
        items: [
          "Proveedores de servicios: terceros que nos ayudan a operar el Servicio (hosting, análisis, entrega de correo) bajo estrictos acuerdos de procesamiento de datos",
          "Proveedores de IA: las entradas de evaluación se envían a Google Gemini para generar diagnósticos; los datos se procesan según las políticas de datos de la API de Google",
          "Requisitos legales: cuando sea requerido por ley, citación o para proteger nuestros derechos",
        ],
      },
      {
        heading: "4. Panel de Análisis",
        body: "Los datos de evaluación agregados y anonimizados (nombre de empresa, cuadrante, puntuaciones) pueden aparecer en el Panel de Análisis público. Si prefiere que su evaluación no aparezca, contáctenos y la eliminaremos de las vistas públicas.",
      },
      {
        heading: "5. Retención de Datos",
        body: "Conservamos sus datos de cuenta y evaluación mientras su cuenta esté activa. Puede solicitar la eliminación de sus datos en cualquier momento contactándonos. Los datos analíticos anonimizados y agregados pueden conservarse indefinidamente.",
      },
      {
        heading: "6. Cookies y Seguimiento",
        body: "Usamos cookies esenciales para mantener su sesión y preferencias. No utilizamos cookies publicitarias ni de seguimiento de terceros. Puede desactivar las cookies en la configuración de su navegador, pero algunas funciones del Servicio pueden no funcionar correctamente.",
      },
      {
        heading: "7. Seguridad",
        body: "Implementamos medidas de seguridad estándar de la industria, incluyendo transmisión de datos cifrada (HTTPS), almacenamiento de contraseñas con hash y controles de acceso. Ningún método de transmisión por internet es 100% seguro; no podemos garantizar seguridad absoluta.",
      },
      {
        heading: "8. Sus Derechos",
        body: "Dependiendo de su jurisdicción, puede tener derecho a:",
        items: [
          "Acceder a los datos personales que conservamos sobre usted",
          "Corregir datos inexactos",
          "Solicitar la eliminación de sus datos",
          "Oponerse o restringir ciertos procesamientos",
          "Portabilidad de datos (recibir sus datos en un formato estructurado)",
        ],
      },
      {
        heading: "9. Privacidad de Menores",
        body: "El Servicio no está dirigido a menores de 16 años. No recopilamos conscientemente datos personales de niños. Si cree que un niño nos ha proporcionado datos personales, contáctenos y los eliminaremos.",
      },
      {
        heading: "10. Cambios en Esta Política",
        body: "Podemos actualizar esta Política de Privacidad periódicamente. Notificaremos a los usuarios registrados sobre cambios materiales. El uso continuado del Servicio tras los cambios constituye la aceptación de la Política actualizada.",
      },
      {
        heading: "11. Contacto",
        body: "¿Preguntas o inquietudes sobre privacidad? Contáctenos en privacy@briteadvisor.com.",
      },
    ],
  },

  fr: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 27 avril 2026",
    sections: [
      {
        heading: "1. Informations que nous collectons",
        body: "Nous collectons les informations que vous nous fournissez directement, notamment :",
        items: [
          "Données de compte : nom, nom de l'entreprise, adresse e-mail et mot de passe lors de l'inscription",
          "Données d'évaluation : vos réponses au questionnaire de diagnostic BRITE, vos scores et classifications de quadrant",
          "Données d'utilisation : pages visitées, fonctionnalités utilisées, horodatages et informations sur le navigateur/appareil",
        ],
      },
      {
        heading: "2. Comment nous utilisons vos informations",
        body: "Nous utilisons les informations collectées pour :",
        items: [
          "Fournir, exploiter et améliorer le Service BRITE Advisor",
          "Générer et stocker des diagnostics d'architecture propulsés par l'IA",
          "Afficher des analyses agrégées sur le Tableau de bord analytique",
          "Envoyer des e-mails transactionnels (confirmation de compte, réinitialisation du mot de passe)",
          "Répondre à vos demandes d'assistance",
          "Surveiller les abus et assurer la sécurité du Service",
        ],
      },
      {
        heading: "3. Partage des données",
        body: "Nous ne vendons pas vos données personnelles. Nous pouvons partager des données avec :",
        items: [
          "Prestataires de services : fournisseurs tiers qui nous aident à exploiter le Service (hébergement, analyse, envoi d'e-mails) dans le cadre d'accords stricts de traitement des données",
          "Fournisseurs d'IA : les entrées d'évaluation sont envoyées à Google Gemini pour générer des diagnostics ; les données sont traitées conformément aux politiques de données de l'API Google",
          "Exigences légales : lorsque la loi, une assignation ou la protection de nos droits l'exige",
        ],
      },
      {
        heading: "4. Tableau de bord analytique",
        body: "Les données d'évaluation agrégées et anonymisées (nom de l'entreprise, quadrant, scores) peuvent apparaître dans le Tableau de bord analytique public. Si vous préférez que votre évaluation n'y figure pas, contactez-nous et nous la retirerons des vues publiques.",
      },
      {
        heading: "5. Conservation des données",
        body: "Nous conservons vos données de compte et d'évaluation aussi longtemps que votre compte est actif. Vous pouvez demander la suppression de vos données à tout moment en nous contactant. Les données analytiques anonymisées et agrégées peuvent être conservées indéfiniment.",
      },
      {
        heading: "6. Cookies et suivi",
        body: "Nous utilisons des cookies essentiels pour maintenir votre session et vos préférences. Nous n'utilisons pas de cookies publicitaires ni de suivi tiers. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités du Service peuvent ne pas fonctionner correctement.",
      },
      {
        heading: "7. Sécurité",
        body: "Nous mettons en œuvre des mesures de sécurité conformes aux normes du secteur, notamment le chiffrement des données (HTTPS), le stockage des mots de passe par hachage et des contrôles d'accès. Aucune méthode de transmission sur internet n'est sûre à 100 % ; nous ne pouvons garantir une sécurité absolue.",
      },
      {
        heading: "8. Vos droits",
        body: "Selon votre juridiction, vous pouvez avoir le droit de :",
        items: [
          "Accéder aux données personnelles que nous détenons vous concernant",
          "Corriger des données inexactes",
          "Demander la suppression de vos données",
          "Vous opposer à certains traitements ou les limiter",
          "Portabilité des données (recevoir vos données dans un format structuré)",
        ],
      },
      {
        heading: "9. Vie privée des enfants",
        body: "Le Service ne s'adresse pas aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles auprès d'enfants. Si vous pensez qu'un enfant nous a fourni des données personnelles, contactez-nous et nous les supprimerons.",
      },
      {
        heading: "10. Modifications de cette politique",
        body: "Nous pouvons mettre à jour cette Politique de confidentialité périodiquement. Nous informerons les utilisateurs inscrits des modifications importantes. La poursuite de l'utilisation du Service après les modifications vaut acceptation de la Politique mise à jour.",
      },
      {
        heading: "11. Contact",
        body: "Des questions ou préoccupations concernant la confidentialité ? Contactez-nous à privacy@briteadvisor.com.",
      },
    ],
  },
};

const awsConfig = {
  Auth: {
    region: process.env.AWS_REGION,
    userPoolId: process.env.AWS_USER_POOL_ID,
    userPoolWebClientId: process.env.AWS_USER_POOL_WEB_CLIENT_ID,
    authenticationFlowType: process.env.AWS_USER_AUTHENTICATION_FLOW_TYPE,
    oauth: {
      domain: process.env.AWS_OAUTH_DOMAIN,
      scope: process.env.AWS_OAUTH_SCOPE,
      redirectSignIn: process.env.AWS_OAUTH_REDIRECT_SIGN_IN_URL,
      redirectSignOut: process.env.AWS_OAUTH_REDIRECT_SIGN_OUT_URL,
      responseType: process.env.AWS_OAUTH_RESPONSE_TYPE
    }
  }
}

export default awsConfig

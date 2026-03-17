const defaultAuthUrl = 'https://auth.verygoodsecurity.com/auth/realms/vgs/protocol/openid-connect/token';

type RequestAccessTokenOptions = {
  authUrl?: string;
  clientId: string;
  clientSecret: string;
};

type RequestAccessTokenResult = {
  statusCode: number;
  data: unknown;
};

export const requestAccessToken = async ({
  authUrl = defaultAuthUrl,
  clientId,
  clientSecret
}: RequestAccessTokenOptions): Promise<RequestAccessTokenResult> => {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  const tokenResponse = await fetch(authUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  const data = await tokenResponse.json();

  return {
    statusCode: tokenResponse.status,
    data
  };
};

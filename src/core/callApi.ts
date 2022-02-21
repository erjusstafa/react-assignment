export const callApi = async (
  url: string,
  config: any,
  auth: boolean,
  gzip: boolean = false,
  key: string = ''
) => {
  let body;
  let queryParams = '';
  if (config) {
    body = config.body;

    if (config.queryParams) {
      const paramsKeys = Object.keys(config.queryParams);

      queryParams = paramsKeys
        .map((key, index) => {
          const prefix = index === 0 ? '?' : '';

          return `${prefix}${key}=${config.queryParams[key]}`;
        })
        .join('&');
    }
  }
  let headers = {
    ...config,
    body: JSON.stringify(body),
  };
  if (auth) {
    headers = {
      ...config,
      headers: {
        authorization: `Bearer ${localStorage.getItem('auth-token')}`,
      },
      mode: 'cors',
      body: JSON.stringify(body),
    };
  }

  if (gzip) {
    headers = {
      ...headers,
      headers: {
        ...headers['headers'],
        //'accept-encoding': 'gzip'
      },
      gzip: true,
    };
  }

  if (key) {
    headers = {
      ...headers,
      headers: {
        ...headers['headers'],
        'x-api-key': key,
      },
    };
  }
  // console.log('headers ', headers)

  try {
    const response = await fetch(`${url}${queryParams}`, headers);
    if (response.ok) {
      const json = await response.text();
      try {
        return JSON.parse(json);
      } catch (error) {
        return json;
      }
    }
    return `${response.status}: ${response.statusText || 'Error'}`;
  } catch (error) {
    return error;
  }
};

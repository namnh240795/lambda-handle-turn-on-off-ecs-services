import ECS from 'aws-sdk/clients/ecs';

export const handler = async (event, context) => {
  
  const turnOn = JSON.parse(event.Records[0].Sns.Message).turnOn;

  const ecs = new ECS({ region: 'ap-southeast-2' });
  const services = [
    'vn-drought-backend-service_update',
    'vn-drought-web-update',
    'msig-indo-be-service',
    'vn-msig-frontend-update',
    'msig-indo-fe-service',
    'vn-typhoon-backend-service',
  ];
  console.log('turnOn', turnOn, JSON.stringify(event));
  for (const service of services) {
    await new Promise((resolve, reject) => {
      ecs.describeServices(
        { services: [service], cluster: 'terranomics' },
        async function (err, data) {
          // console.log('ecs data', JSON.stringify(data));
          if (err) {
            console.log('error', JSON.stringify(err));
            reject(err);
          } else {
            ecs.updateService(
              {
                service: service,
                cluster: 'terranomics',
                desiredCount: turnOn ? 1 : 0,
              },
              function (err, data) {
                if (err) {
                  // console.log('error', JSON.stringify(err.stack));
                  reject(error);
                } else {
                  console.log('service', service)
                  resolve(data);
                }
              },
            );
          }
        },
      );
    });
  }
};

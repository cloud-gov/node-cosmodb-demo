# Node.js Cosmo DB Demo App

A simple [ExpressJS](https://expressjs.com/) app demonstrating how to use [Azure's Cosmo DB](https://azure.microsoft.com/en-us/services/cosmos-db/) with cloud.gov.

## Usage

Clone this repo and deploy your app to cloud.gov without starting it:

```
~$ clone https://github.com/cloud-gov/node-cosmodb-demo.git
~$ cd node-cosmodb-demo
~$ cf push --no-start
```

Sign up for Azure and create a new Cosmo DB Account.

In the Azure Portal, when viewing the details of your Cosmo DB account, go to `Settings` >> `Connection String` and obtain the following values:

* USERNAME
* PRIMARY PASSWORD
* PORT

Create a user-provided service instance in cloud.gov to hold these credentials:

```
~$ cf cups COSMO_DB_SERVICE -p '{"user":"USERNAME","password":"PRIMARY PASSWORD", "port": "PORT"}'
```

Bind the application to the new user-provided service instance:

```
~$ cf bind-service node-cosmodb-demo COSMO_DB_SERVICE
```

Start your application:

```
~$ cf restage node-cosmodb-demo
```

After the app starts, make sure it is running and obtain the route:

```
~$ cf app node-cosmodb-demo
```

You should see output like the following: 

```
name:              node-cosmodb-demo
requested state:   started
routes:            node-cosmodb-demo-boisterous-sitatunga.app.cloud.gov
last uploaded:     Thu 18 Jun 09:45:58 EDT 2020
stack:             cflinuxfs3
buildpacks:        nodejs

type:           web
instances:      1/1
memory usage:   256M
     state     since                  cpu    memory          disk          details
#0   running   2020-06-18T13:46:10Z   0.2%   29.3M of 256M   90.1M of 1G   
```

You can insert documents in your Cosmo DB instance by doing something similar to:

```
~$ curl -X POST https://{your-app-route}.app.cloud.gov/save/db-name/collection-name \
 -d '[{"foo":"bar"},{"bar":"foo"}]' \
 -H 'Content-type: application/json'
```

Note - You can change the `db-name` and `collection-name` segments in the route you POST to to designate with db and collection documents get stored in.

## A Note on Compliance

When you use cloud.gov in general, your application inherits the compliance of the [cloud.gov FedRAMP P-ATO](https://cloud.gov/docs/overview/fedramp-tracker/), which inherits compliance from the AWS GovCloud FedRAMP P-ATO.  When you use this Cosmo DB, you opt into using an Azure service that is not in the cloud.gov FedRAMP P-ATO boundary, but is in the [Azure FedRAMP boundary](https://docs.microsoft.com/en-us/azure/azure-government/compliance/azure-services-in-fedramp-auditscope).

You are responsible for obtaining appropriate authorization from your agency to use Cosmo DB for your system. The appropriate steps depend on your agency; they may include discussing this with your Authorizing Official and documenting it as part of your ATO (for example as part of [SC-12](https://nvd.nist.gov/800-53/Rev4/control/SC-12) or [SA-9](https://nvd.nist.gov/800-53/Rev4/control/SA-9)).

import {Duration, Stack, StackProps, Tags} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {CfnUserPoolGroup, UserPool, VerificationEmailStyle} from "aws-cdk-lib/aws-cognito"
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const pool = new UserPool(this, 'donfiado', {
      userPoolName:"donfiado-app",
      signInAliases:{
        username:true,
        preferredUsername:true,
        email:true
      },
      standardAttributes:{
        email:{required:true, mutable:false},
      },
      passwordPolicy: {
        minLength: 12,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
      },
      selfSignUpEnabled:true,
      userVerification:{
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: 'Thanks for signing up to our awesome app! Your verification code is {####}',
      }
    });

    const client = pool.addClient('donfiado-app-client',{
      authFlows:{
        userPassword:true
      },
      preventUserExistenceErrors:true,
      accessTokenValidity: Duration.minutes(60),
      idTokenValidity: Duration.minutes(60),
      refreshTokenValidity: Duration.days(30),
    });
    const clientId = client.userPoolClientId;
    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });


    const cfnUserPoolGroup = new CfnUserPoolGroup(this, 'MyCfnUserPoolGroup', {
      userPoolId: pool.userPoolId,

      // the properties below are optional
      description: 'description',
      groupName: 'groupName',
      precedence: 123,
      roleArn: 'roleArn',
    });


    Tags.of(this).add('StackType', 'donfiado-tags');
  }
}

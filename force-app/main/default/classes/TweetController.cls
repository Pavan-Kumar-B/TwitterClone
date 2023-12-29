public with sharing class TweetController {
    @AuraEnabled
    public static String createTweet(String content) {
        //Perform validation and security checks
        if (String.isBlank(content) || content.length() > 280) {
            throw new AuraHandledException('Invalid tweet content');
        }

        // Create the Tweet__c record
        Tweet__c newTweet = new Tweet__c();
        newTweet.Content__c = content;
		newTweet.Author__c = UserInfo.getUserId();
        insert newTweet;

        // Return the ID of the created tweet for potential use in LWC
        return newTweet.Id;
    }
}
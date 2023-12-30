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
    @AuraEnabled(cacheable=true)
    public static List<Tweet__c> getTweets()
    {   
         list<Tweet__c> t = [SELECT Id,Author__r.Name,LikeCount__c,RetweetCount__c,Content__c FROM Tweet__c ORDER BY CreatedDate DESC ];
       
        return t;
    }

    @AuraEnabled
    public static void createRetweet(String originalTweetId)
    {   
        String retweetingUserId=UserInfo.getUserId();
        Tweet__c originalTweet = [SELECT Id,Author__c FROM Tweet__c WHERE Id = :originalTweetId LIMIT 1];

       if (originalTweet.Author__c == retweetingUserId) {
            throw new AuraHandledException('Cannot retweet your own tweet');
        }
        Retweet__c retweet = new Retweet__c(OriginalTweetId__c = originalTweetId, RetweetingUser__c = retweetingUserId);
        insert retweet;
    }

    @AuraEnabled
    public static Boolean likeTweet(String tweetId) {
        Boolean liked;
        String likingUserId = UserInfo.getUserId();
        List<Tweet__c> tweets = [SELECT Id,LikeCount__c,Author__c  FROM Tweet__c WHERE Id = :tweetId LIMIT 1];
        Tweet__c tweet;
        if(!tweets.isEmpty())
        {
            tweet=tweets[0];
        }
        System.debug(tweet);
         if (tweet == null) {
             throw new AuraHandledException('Invalid tweet ID');
         }

        // Ensure the user isn't liking their own tweet
        if (tweet.Author__c ==  likingUserId) {
             throw new AuraHandledException('Cannot like your own tweet');
         }

        // Create or update the Like__c record
        List<Like__c> likes = [SELECT Id FROM Like__c WHERE TweetId__c =:tweetId  AND LikingUser__c =:likingUserId LIMIT 1];
        Like__c l;
        if(!likes.isEmpty())
        {
            l=likes[0];
        }
        System.debug(l);
        if (l == null) {
            l = new Like__c(TweetId__c = tweetId, LikingUser__c = likingUserId);
            System.debug(l);
            insert l;
            System.debug(tweet);
            tweet.LikeCount__c++;
            update tweet;
            liked = true;
            return liked;
        } else {
            delete l;
            tweet.LikeCount__c--;
            update tweet;
            liked = false;
            return liked;
        }
    }
    
}
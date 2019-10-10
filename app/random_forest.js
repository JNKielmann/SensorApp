export var RandomForestClassifier = function() {

    var findMax = function(nums) {
        var index = 0;
        for (var i = 0; i < nums.length; i++) {
            index = nums[i] > nums[index] ? i : index;
        }
        return index;
    };

    var trees = new Array();

    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[25] <= 2.062011182308197) {
            classes[0] = 63; 
            classes[1] = 0; 
            classes[2] = 0; 
        } else {
            if (features[17] <= 18.14667797088623) {
                classes[0] = 0; 
                classes[1] = 23; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 1; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[19] <= 1.119309663772583) {
            classes[0] = 59; 
            classes[1] = 0; 
            classes[2] = 0; 
        } else {
            if (features[44] <= 60.45610237121582) {
                classes[0] = 0; 
                classes[1] = 26; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 2; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[49] <= 63.38072967529297) {
            classes[0] = 51; 
            classes[1] = 0; 
            classes[2] = 0; 
        } else {
            if (features[26] <= 15.200681328773499) {
                classes[0] = 0; 
                classes[1] = 34; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 2; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[43] <= 40.279666900634766) {
            classes[0] = 60; 
            classes[1] = 0; 
            classes[2] = 0; 
        } else {
            if (features[13] <= 30.704228401184082) {
                classes[0] = 0; 
                classes[1] = 22; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 5; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[23] <= 0.6880922019481659) {
            classes[0] = 63; 
            classes[1] = 0; 
            classes[2] = 0; 
        } else {
            if (features[13] <= 30.704228401184082) {
                classes[0] = 0; 
                classes[1] = 21; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 3; 
            }
        }
    
        return findMax(classes);
    });
    
    this.predict = function(features) {
        var classes = new Array(3).fill(0);
        for (var i = 0; i < trees.length; i++) {
            classes[trees[i](features)]++;
        }
        return findMax(classes);
    }

};

if (typeof process !== 'undefined' && typeof process.argv !== 'undefined') {
    if (process.argv.length - 2 == 52) {

        // Features:
        var features = process.argv.slice(2);

        // Prediction:
        var prediction = new RandomForestClassifier().predict(features);
        console.log(prediction);

    }
}
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
        
        if (features[21] <= 6.007631778717041) {
            if (features[19] <= 1.2578880786895752) {
                if (features[46] <= -1.754746913909912) {
                    classes[0] = 11; 
                    classes[1] = 0; 
                    classes[2] = 1; 
                } else {
                    classes[0] = 89; 
                    classes[1] = 0; 
                    classes[2] = 0; 
                }
            } else {
                if (features[43] <= 152.8642349243164) {
                    classes[0] = 2; 
                    classes[1] = 119; 
                    classes[2] = 0; 
                } else {
                    classes[0] = 0; 
                    classes[1] = 0; 
                    classes[2] = 12; 
                }
            }
        } else {
            if (features[2] <= 14.354381561279297) {
                classes[0] = 0; 
                classes[1] = 3; 
                classes[2] = 0; 
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 138; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[15] <= 0.9773330688476562) {
            if (features[22] <= 0.16685812920331955) {
                if (features[27] <= 0.7693018615245819) {
                    classes[0] = 100; 
                    classes[1] = 0; 
                    classes[2] = 0; 
                } else {
                    classes[0] = 0; 
                    classes[1] = 1; 
                    classes[2] = 0; 
                }
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 3; 
            }
        } else {
            if (features[3] <= 3.6968765258789062) {
                if (features[20] <= -2.215481996536255) {
                    classes[0] = 0; 
                    classes[1] = 116; 
                    classes[2] = 0; 
                } else {
                    classes[0] = 10; 
                    classes[1] = 0; 
                    classes[2] = 0; 
                }
            } else {
                classes[0] = 0; 
                classes[1] = 0; 
                classes[2] = 145; 
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[1] <= 23.057241439819336) {
            if (features[23] <= 0.9862040281295776) {
                if (features[21] <= 1.888100504875183) {
                    classes[0] = 106; 
                    classes[1] = 0; 
                    classes[2] = 3; 
                } else {
                    classes[0] = 0; 
                    classes[1] = 0; 
                    classes[2] = 3; 
                }
            } else {
                if (features[34] <= -161.2565155029297) {
                    classes[0] = 1; 
                    classes[1] = 0; 
                    classes[2] = 0; 
                } else {
                    classes[0] = 0; 
                    classes[1] = 127; 
                    classes[2] = 0; 
                }
            }
        } else {
            classes[0] = 0; 
            classes[1] = 0; 
            classes[2] = 135; 
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[20] <= -18.094364166259766) {
            classes[0] = 0; 
            classes[1] = 0; 
            classes[2] = 148; 
        } else {
            if (features[3] <= 0.8373985588550568) {
                if (features[0] <= 0.5040132701396942) {
                    classes[0] = 99; 
                    classes[1] = 0; 
                    classes[2] = 1; 
                } else {
                    classes[0] = 1; 
                    classes[1] = 1; 
                    classes[2] = 2; 
                }
            } else {
                if (features[20] <= -2.753737688064575) {
                    classes[0] = 0; 
                    classes[1] = 108; 
                    classes[2] = 0; 
                } else {
                    classes[0] = 12; 
                    classes[1] = 3; 
                    classes[2] = 0; 
                }
            }
        }
    
        return findMax(classes);
    });
    
    trees.push(function(features) {
        var classes = new Array(3);
        
        if (features[11] <= 5.374420642852783) {
            if (features[2] <= 2.744413375854492) {
                if (features[6] <= -0.4562918394804001) {
                    classes[0] = 0; 
                    classes[1] = 0; 
                    classes[2] = 6; 
                } else {
                    classes[0] = 130; 
                    classes[1] = 0; 
                    classes[2] = 0; 
                }
            } else {
                classes[0] = 0; 
                classes[1] = 104; 
                classes[2] = 0; 
            }
        } else {
            classes[0] = 0; 
            classes[1] = 0; 
            classes[2] = 135; 
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
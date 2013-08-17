var debug = false; // flip this to get extra console log messages

$(document).ready(function() {
    // Tabs
    var tabs = $('#tabs > ul');
    $('a', tabs).click(function() {
        if ($(this).parent().hasClass('active') == false) { // only initialize when the tab isn't already active
            if (GUI.operating_mode != 1) {
                command_log('You <span style="color: red;">can\'t</span> view tabs at the moment. You need to <span style="color: green">connect</span> first.');
                return;
            }
            
            // get tab index
            var index = $(this).parent().index();
            
            if (GUI.tab_lock[index] != 1) { // tab is unlocked 
                // disable previous active button
                $('li', tabs).removeClass('active');
                
                // Highlight selected button
                $(this).parent().addClass('active');
                
                if ($(this).parent().hasClass('tab_TX')) {
                    tab_initialize_tx_module();
                } else if ($(this).parent().hasClass('tab_RX')) {
                    tab_initialize_rx_module();
                } else if ($(this).parent().hasClass('tab_uploader')) {
                    tab_initialize_uploader();
                } else if ($(this).parent().hasClass('tab_about')) {
                    tab_initialize_about();
                }
            } else { // in case the requested tab is locked, echo message
                command_log("You <span style=\"color: red\">can't</span> do this right now, please wait for current operation to finish ...");
            }            
        }
    }); 
    
    // load "defualt.html" by default
    tab_initialize_default();
    
    // for debug purposes only
});

function command_log(message) {
    var d = new Date();
    var time = ((d.getHours() < 10) ? '0' + d.getHours(): d.getHours()) 
        + ':' + ((d.getMinutes() < 10) ? '0' + d.getMinutes(): d.getMinutes()) 
        + ':' + ((d.getSeconds() < 10) ? '0' + d.getSeconds(): d.getSeconds());
    
    $('div#command-log > div.wrapper').append('<p>' + time + ' -- ' + message + '</p>');
    $('div#command-log').scrollTop($('div#command-log div.wrapper').height());    
}

// bitwise help functions
function highByte(num) {
    return num >> 8;
}

function lowByte(num) {
    return 0x00FF & num;
}

function bit_check(num, bit) {
    return ((num) & (1 << (bit)));
}

function bit_set(num, bit) {
    return num | 1 << bit;
}

function bit_clear(num, bit) {
    return num & ~(1 << bit);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// input field validator (using min max parameters inside html)
function validate_input_bounds(element) {
    // get respective values
    var min = parseInt(element.prop('min'));
    var max = parseInt(element.prop('max'));
    var val = parseInt(element.val());
    
    // check if input/selected value is within range
    if (val >= min && val <= max) {
        // within bounds, success
        element.removeClass('validation_failed');
        
        return true;
    } else {
        // not within bounds, failed
        element.addClass('validation_failed');
        
        return false;
    }
}
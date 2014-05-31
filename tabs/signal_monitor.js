function tab_initialize_signal_monitor() {
    ga_tracker.sendAppView('Signal Monitor');

    $('#content').load("./tabs/signal_monitor.html", process_html);

    function process_html() {
        GUI.active_tab = 'signal_monitor';

        // translate to user-selected language
        localize();

        var status = $('.tab-signal_monitor .status .indicator');
        var bars = $('.tab-signal_monitor .bars');

        // prepare generic options
        var options = "";
        for (var i = 0, analog = 0; i < 18; i++) {
            if (i < 16) {
                options += '<option value="' + i +'">' + chrome.i18n.getMessage('signal_monitor_channel', [i + 1]) + '</option>';
            } else {
                options += '<option value="' + i + '">' + chrome.i18n.getMessage('signal_monitor_analog', [analog++]) + '</option>';
            }
        }

        // spawn each line
        for (var i = 0; i < PPM.channels.length; i++) {
            bars.append('\
                <tr class="bar">\
                    <td class="source">' + chrome.i18n.getMessage('signal_monitor_channel', [i + 1]) + '</td>\
                    <td class="output"><select>' + options + '</select></td>\
                    <td class="meter"><meter min="800" max="2200" low="1000" high="2000"></meter></td>\
                    <td class="value"></td>\
                </tr>\
            ');
            bars.find('tr:last .output select').val(TX_CONFIG.chmap[i]);
        }

        $('a.save_to_eeprom').click(function() {
            var i = 0;
            $('.output select', bars).each(function() {
                TX_CONFIG.chmap[i++] = parseInt($(this).val());
            });

            send_TX_config();
        });

        var meter_array = [];
        $('td.meter meter', bars).each(function() {
            meter_array.push($(this));
        });

        var meter_values_array = [];
        $('td.value', bars).each(function() {
            meter_values_array.push($(this));
        });

        function get_ppm() {
            PSP.send_message(PSP.PSP_REQ_PPM_IN, false, false, update_ui);
        }

        function update_ui() {
            if (PPM.ppmAge < 8) {
                status.addClass('ok');
                status.text(chrome.i18n.getMessage('signal_monitor_data_ok'));
            } else {
                status.removeClass('ok');
                status.text(chrome.i18n.getMessage('signal_monitor_data_bad'));
            }

            // update bars with latest data
            for (var i = 0; i < PPM.channels.length; i++) {
                meter_array[i].val(PPM.channels[i]);
                meter_values_array[i].text('[ ' + PPM.channels[i] + ' ]');
            }
        }

        GUI.interval_add('ppm_data_pull', get_ppm, 50, true);
    }
}
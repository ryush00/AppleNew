require 'mechanize'
require 'washbullet'
require 'active_support/core_ext/time'
require 'telegram/bot'
telegramtoken = 'TOKEN_HERE'


@agent = Mechanize.new do |a|
  a.follow_meta_refresh = true
  a.keep_alive = false
  a.agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
end


    loop do
        page = @agent.get("https://www.apple.com/ios/feature-availability/")
        if (kcount = page.parser.text.scan(/(Republic of Korea)/).count) != 14
            Telegram::Bot::Client.run(telegramtoken) do |bot|
                bot.api.send_message(chat_id: "ID_HERE", text: "Test Message")
            end

            client = Washbullet::Client.new('KEY_HERE')



            break
            client.push_link(
                receiver:   :channel, # :email, :channel, :client
                identifier: 'applekoreanewservice',
                params: {
                    title: '애플 새로운 서비스 모니터링',
                    url:  'https://www.apple.com/ios/feature-availability/',
                    body:  "새로운 애플 서비스가 출시된 것 같습니다! 아래 페이지를 확인해보세요!\n15 -> " + kcount.to_s,
                }
            )
            puts Time.now.in_time_zone('Seoul').strftime("%Y/%m/%d %H:%M:%S") + " 알림 전송 완료"
            break
        else
            puts Time.now.in_time_zone('Seoul').strftime("%Y/%m/%d %H:%M:%S") + " 변화없음"
        end

        sleep 60
    end

#(1..63).each do |n|
#    download_comic 507275, n
#    sleep(0.5)
#end

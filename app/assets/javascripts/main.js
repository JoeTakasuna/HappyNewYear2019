enchant();

window.onload = function() {

    var game_ = new Game(320, 320);
    game_.fps = 24;
	game_.preload('/start.png', '/gameover.png','/retry_button.png', '/chara1.png', '/bg1.png', '/bg2.png', '/hurdle.png', '/igaguri.png', '/bird.png', '/goal.png');

    game_.onload = function() {

        /**
        * タイトルシーン
        */
        var createStartScene = function() {

            var scene = new Scene();
			scene.backgroundColor = '#86B81B';


            var startImage = new Sprite(236, 48);
            startImage.image = game_.assets['/start.png'];
            startImage.x = 42;
            startImage.y = 162;
            scene.addChild(startImage);


			var title = new Label('亥年正月企画<br> <br>「2019年を目指せ!!」');
            title.width = 320;
            title.textAlign = 'center';
            title.color = '#ffffff';
            title.x = 0;
            title.y = 50;
            title.font = '30px sans-serif';
            scene.addChild(title);


			var info = new Label('画面をタップで<br>ゲーム開始 / いのししがジャンプ');
            info.width = 320;
            info.textAlign = 'center';
            info.color = '#ffffff';
            info.x = 0;
            info.y = 242;
            info.font = '20px sans-serif';
            scene.addChild(info);


			scene.addEventListener(Event.TOUCH_START, function(e){

                game_.replaceScene(createGameScene());
            });


            return scene;

        };

        /**
        * ゲームシーン
        */
        var createGameScene = function() {

            var scroll = 0;




            var GROUND_LINE = 250;
            var SCROLL_SPEED = 10;

            var scene = new Scene();
            scene.backgroundColor = '#8cc820';


            var bg1 = new Sprite(320, 320);
            bg1.image = game_.assets['/bg1.png'];
            bg1.x = 0;
            bg1.y = 0;
            scene.addChild(bg1);


            var bg2 = new Sprite(320, 320);
            bg2.image = game_.assets['/bg2.png'];
            bg2.x = 320;
            bg2.y = 0;
            scene.addChild(bg2);


            var scoreLabel = new Label("");
            scoreLabel.color = '#fff';
			scoreLabel.font = '32px sans-serif';
            scene.addChild(scoreLabel);


            var kuma = new Sprite(64, 64);
            kuma.image = game_.assets['/chara1.png'];
            kuma.x = 80;
            kuma.y = GROUND_LINE - kuma.height;
            scene.addChild(kuma);


            var kuma_hit = new Sprite(1, 1);

            kuma_hit.x = kuma.x + kuma.width / 2;
            kuma_hit.y = kuma.y + kuma.height / 2;
            scene.addChild(kuma_hit);


            var hurdle = new Sprite(50, 100);
            hurdle.image = game_.assets['/hurdle.png'];
            hurdle.x = -hurdle.width;
            hurdle.y = GROUND_LINE - hurdle.height;
            scene.addChild(hurdle);


            var igaguri = new Sprite(42, 32);
            igaguri.image = game_.assets['/igaguri.png'];
            igaguri.x = -igaguri.width;
            igaguri.y = GROUND_LINE - igaguri.height;
            scene.addChild(igaguri);


            var bird = new Sprite(64, 44);
            bird.image = game_.assets['/bird.png'];
            bird.x = -bird.width;
            bird.y = 120;
            scene.addChild(bird);


            var kumaDead = function() {
                game_.pushScene(createGameoverScene(scroll));
			};


			var Goal = function() {
				alert("ゴールおめでとう！メッセージがあります");
				game_.pushScene(createGoalScene(scroll));
			};


            scene.addEventListener(Event.ENTER_FRAME, function(){

                scroll += SCROLL_SPEED;
                scoreLabel.text = scroll.toString()+'年走破';




                if (scroll % 640 === 0) {
                    hurdle.x = 320;
                }
                if (scroll % 550 === 0) {
                    igaguri.x = 320;
                }
                if (scroll % 1800 === 0) {
                    bird.x = 320;
                }


                if (hurdle.x > -hurdle.width) {
                    hurdle.x -= SCROLL_SPEED;
                    if (hurdle.intersect(kuma_hit)) {
                        kumaDead();
                    }
                }
                if (igaguri.x > -igaguri.width) {
                    igaguri.x -= SCROLL_SPEED;
                    if (igaguri.intersect(kuma_hit)) {
                        kumaDead();
                    }
                }
                if (bird.x > -bird.width) {
                    bird.x -= SCROLL_SPEED * 1.2;
                    if (bird.frame > 0) {
                        bird.frame = 0;
                    } else {
                        bird.frame = 1;
                    }
                    if (bird.intersect(kuma_hit)) {
                        kumaDead();
                    }
                }

					if (scroll == 2030) {
						Goal();
					}





                kuma.frame ++;
                if (kuma.frame > 2) {
                    kuma.frame = 0;
                }


                kuma_hit.x = kuma.x + kuma.width/2;
                kuma_hit.y = kuma.y + kuma.height/2;


                bg1.x -= SCROLL_SPEED;
                bg2.x -= SCROLL_SPEED;
                if (bg1.x <= -320) {
                    bg1.x = 320;
                }
                if (bg2.x <= -320) {
                    bg2.x = 320;
                }

            });


            scene.addEventListener(Event.TOUCH_START, function(e){

                kuma.tl.moveBy(0, -120, 12, enchant.Easing.CUBIC_EASEOUT)
                       .moveBy(0, 120, 12, enchant.Easing.CUBIC_EASEIN);
            });

            return scene;
        };


        /**
        * ゲームオーバーシーン
        */
        var createGameoverScene = function(scroll) {

            var scene = new Scene();
            scene.backgroundColor = 'rgba(0, 0, 0, 0.5)';


            var gameoverImage = new Sprite(189, 97);
            gameoverImage.image = game_.assets['/gameover.png'];
            gameoverImage.x = 66;
            gameoverImage.y = 160;
            scene.addChild(gameoverImage);


            var buttonRetry = new Sprite(320, 32);
            buttonRetry.image = game_.assets['/retry_button.png'];
            buttonRetry.x = 0;
            buttonRetry.y = 274;
            scene.addChild(buttonRetry);


            scene.addEventListener(Event.TOUCH_END, function(){
                game_.popScene();
                game_.replaceScene(createStartScene());
            });


            var scoreLabel = new Label(scroll.toString() + '年');
            scoreLabel.width = 320;
            scoreLabel.textAlign = 'center';
            scoreLabel.color = '#ffffff';
            scoreLabel.x = 0;
            scoreLabel.y = 24;
            scoreLabel.font = '84px sans-serif';
            scene.addChild(scoreLabel);


            var scoreInfoLabel = new Label('走り抜いた');
            scoreInfoLabel.width = 320;
            scoreInfoLabel.textAlign = 'center';
            scoreInfoLabel.color = '#ffffff';
            scoreInfoLabel.x = 0;
            scoreInfoLabel.y = 110;
            scoreInfoLabel.font = '32px sans-serif';
            scene.addChild(scoreInfoLabel);


            return scene;

		};


		/**
		* ゴールシーン
		*/
		var createGoalScene = function(scroll) {

			var scene = new Scene();


			var goalImage = new Sprite(320, 320);
			goalImage.image = game_.assets['/goal.png'];
			goalImage.x = 0;
			goalImage.y = 0;
			scene.addChild(goalImage);


			var scoreInfoLabel = new Label('あけましておめでとうございます。<br>私、ジョーはITエンジニアとして<br>2020年より働く予定です。<br>モノづくりで世界をより良くしたい<br>という気持ちはずっと変わりません。<br> <br>このゲームと同じように猪突猛進で<br>周りを振り回してばかりの私ですが、<br>今後とも一緒に楽しい世界を<br>目指してくだされば幸いです。<br> <br>　　　　　　　ジョー');
			scoreInfoLabel.width = 320;
			scoreInfoLabel.textAlign = 'center';
			scoreInfoLabel.color = '#ffffff';
			scoreInfoLabel.x = 0;
			scoreInfoLabel.y = 10;
			scoreInfoLabel.font = '17px sans-serif';
			scoreInfoLabel.backgroundColor = 'rgba(0, 0, 0, 0.5)';
			scene.addChild(scoreInfoLabel);


			return scene;

		};


        game_.replaceScene(createStartScene());

    };

    game_.start();

};

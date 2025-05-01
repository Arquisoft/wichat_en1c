import io.gatling.core.body.RawFileBody;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import java.util.Map;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

public class RecordedSimulation extends Simulation {

    private HttpProtocolBuilder httpProtocol = http
            .baseUrl("http://localhost:8000")
            .inferHtmlResources()
            .acceptHeader("application/json, text/plain, */*")
            .acceptEncodingHeader("gzip, deflate")
            .acceptLanguageHeader("en-US,en;q=0.5")
            .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0");

    private Map<CharSequence, String> headers_0 = Map.ofEntries(
            Map.entry("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"),
            Map.entry("If-None-Match", "\"e7a88ba0869b93f034a774aef52b85b07ff21549\""),
            Map.entry("Priority", "u=0, i"),
            Map.entry("Upgrade-Insecure-Requests", "1")
    );

    private Map<CharSequence, String> headers_1 = Map.ofEntries(
            Map.entry("Accept", "*/*"),
            Map.entry("If-None-Match", "\"93ca59bc0b85c7a02a4b722dbb74ad9fba6b39ad\"")
    );

    private Map<CharSequence, String> headers_2 = Map.ofEntries(
            Map.entry("Accept", "text/css,*/*;q=0.1"),
            Map.entry("If-None-Match", "\"689851da1d97133d3e5fd1f6db554681d6c8bd2a\""),
            Map.entry("Priority", "u=2")
    );

    private Map<CharSequence, String> headers_3 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("If-None-Match", "\"373d5255875917e89bdb11df31d35b1d7c58e3bb\""),
            Map.entry("Priority", "u=5")
    );

    private Map<CharSequence, String> headers_4 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("If-None-Match", "\"3d6b4e8ccad0887938a5cd15317612834f8d3b77\""),
            Map.entry("Priority", "u=5")
    );

    private Map<CharSequence, String> headers_5 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("If-None-Match", "\"c37bec4841bb71a92889f5c4e952af6897a26f85\""),
            Map.entry("Priority", "u=5, i")
    );

    private Map<CharSequence, String> headers_6 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("If-None-Match", "\"e6a0d381de099d16562bcbe919a3696fd51feaf2\""),
            Map.entry("Priority", "u=5, i")
    );

    private Map<CharSequence, String> headers_7 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("If-None-Match", "\"f452ae6627bd06eddf4d1a56a266088242c731b0\""),
            Map.entry("Priority", "u=5, i")
    );

    private Map<CharSequence, String> headers_8 = Map.ofEntries(
            Map.entry("Accept", "*/*"),
            Map.entry("Access-Control-Request-Headers", "content-type"),
            Map.entry("Access-Control-Request-Method", "POST"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=4")
    );

    private Map<CharSequence, String> headers_9 = Map.ofEntries(
            Map.entry("Content-Type", "application/json"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=0")
    );

    private Map<CharSequence, String> headers_16 = Map.ofEntries(
            Map.entry("Accept", "*/*"),
            Map.entry("Access-Control-Request-Headers", "authorization"),
            Map.entry("Access-Control-Request-Method", "GET"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=4")
    );

    private Map<CharSequence, String> headers_18 = Map.ofEntries(
            Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=0-")
    );

    private Map<CharSequence, String> headers_19 = Map.ofEntries(
            Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("If-None-Match", "\"982912d7e2390c33059515ecd9951ac29ea05820\""),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=0-")
    );

    private Map<CharSequence, String> headers_20 = Map.ofEntries(
            Map.entry("Accept", "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("If-None-Match", "\"06ce083f335820e2b15919e8dbb028af5079a1d1\""),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=0-")
    );

    private Map<CharSequence, String> headers_22 = Map.ofEntries(
            Map.entry("If-None-Match", "W/\"14c-s7GiHhtBlcdG7XtEYB1/RLcAZ+Y\""),
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_23 = Map.ofEntries(
            Map.entry("If-None-Match", "W/\"20-hx22dDhBlWaOk3e8O+FlVG4DS1E\""),
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_24 = Map.ofEntries(
            Map.entry("Accept", "image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5"),
            Map.entry("Priority", "u=5, i")
    );

    private Map<CharSequence, String> headers_25 = Map.ofEntries(
            Map.entry("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=0-")
    );

    private Map<CharSequence, String> headers_26 = Map.ofEntries(
            Map.entry("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=5701632-")
    );

    private Map<CharSequence, String> headers_27 = Map.ofEntries(
            Map.entry("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=720896-")
    );

    private Map<CharSequence, String> headers_34 = Map.ofEntries(
            Map.entry("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=10354688-")
    );

    private Map<CharSequence, String> headers_35 = Map.ofEntries(
            Map.entry("Accept", "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5"),
            Map.entry("Accept-Encoding", "identity"),
            Map.entry("Priority", "u=4"),
            Map.entry("Range", "bytes=393216-")
    );

    private Map<CharSequence, String> headers_36 = Map.ofEntries(
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_37 = Map.ofEntries(
            Map.entry("Accept", "*/*"),
            Map.entry("Access-Control-Request-Headers", "authorization,content-type"),
            Map.entry("Access-Control-Request-Method", "POST"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=4")
    );

    private Map<CharSequence, String> headers_38 = Map.ofEntries(
            Map.entry("Content-Type", "application/json"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=0"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_40 = Map.ofEntries(
            Map.entry("If-None-Match", "W/\"118-BY7gV7NBvLns1l2qoxiPin1YdEM\""),
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_48 = Map.ofEntries(
            Map.entry("If-None-Match", "W/\"104-RSDmrH4gosh+HOo/Ai9bRwOcVjw\""),
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_50 = Map.ofEntries(
            Map.entry("Content-Type", "application/json"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("authorization", "Bearer #{authToken}")
    );

    private Map<CharSequence, String> headers_51 = Map.ofEntries(
            Map.entry("Accept", "*/*"),
            Map.entry("Access-Control-Request-Headers", "authorization"),
            Map.entry("Access-Control-Request-Method", "POST"),
            Map.entry("Origin", "http://localhost"),
            Map.entry("Priority", "u=4")
    );

    private String uri1 = "localhost";

    private ScenarioBuilder scn = scenario("RecordedSimulation")
            .exec(session -> session.set("userId", session.userId()))
            .exec(
                    http("Enter application")
                            .get("http://" + uri1 + "/")
                            .headers(headers_0)
                            .resources(
                                    http("request_1")
                                            .get("http://" + uri1 + "/static/js/main.b4fce293.js")
                                            .headers(headers_1),
                                    http("request_2")
                                            .get("http://" + uri1 + "/static/css/main.e6c13ad2.css")
                                            .headers(headers_2),
                                    http("request_3")
                                            .get("http://" + uri1 + "/static/media/logo.ea86714c6c9fa31b3a286873d0b6587b.svg")
                                            .headers(headers_3),
                                    http("request_4")
                                            .get("http://" + uri1 + "/WIChatTitle.svg")
                                            .headers(headers_4)
                            ),
                    http("Select game")
                            .get("http://" + uri1 + "/pVai.svg")
                            .headers(headers_5)
                            .resources(
                                    http("request_6")
                                            .get("http://" + uri1 + "/normal.svg")
                                            .headers(headers_6),
                                    http("request_7")
                                            .get("http://" + uri1 + "/custom.svg")
                                            .headers(headers_7)
                            ),
                    http("request_8")
                            .options("/auth/signup")
                            .headers(headers_8)
                            .resources(
                                    http("Signup")
                                            .post("/auth/signup")
                                            .headers(headers_9)
                                            .body(StringBody("{\"username\":\"randomuser#{userId}\",\"password\":\"validPassword1!\"}"))
                            ),
                    http("request_10")
                            .options("/auth/login")
                            .headers(headers_8)
                            .resources(
                                    http("Login (invalid)")
                                            .post("/auth/login")
                                            .headers(headers_9)
                                            .body(StringBody("{\"username\":\"randomuser#{userId}\",\"password\":\"invalidPassword1!\"}"))
                                            .check(status().is(401)),
                                    http("Login (valid)")
                                            .post("/auth/login")
                                            .headers(headers_9)
                                            .body(StringBody("{\"username\":\"randomuser#{userId}\",\"password\":\"validPassword1!\"}"))
                                            .check(jsonPath("$.token").saveAs("authToken"))
                            ),
                    http("Select game 2")
                            .get("http://" + uri1 + "/pVai.svg")
                            .headers(headers_5)
                            .resources(
                                    http("request_14")
                                            .get("http://" + uri1 + "/normal.svg")
                                            .headers(headers_6),
                                    http("request_15")
                                            .get("http://" + uri1 + "/custom.svg")
                                            .headers(headers_7)
                            ),
                    http("request_16")
                            .options("/game/config")
                            .headers(headers_16)
                            .resources(
                                    http("Start game")
                                            .get("/game/config")
                                            .headers(headers_23),
                                    http("request_17")
                                            .options("/game/question")
                                            .headers(headers_16),
                                    http("Get question 1")
                                            .get("/game/question")
                                            .headers(headers_22),
                                    http("request_18")
                                            .get("http://" + uri1 + "/correct.mp3")
                                            .headers(headers_18),
                                    http("request_19")
                                            .get("http://" + uri1 + "/correct.mp3")
                                            .headers(headers_19),
                                    http("request_20")
                                            .get("http://" + uri1 + "/wrong.mp3")
                                            .headers(headers_20),
                                    http("request_21")
                                            .get("http://" + uri1 + "/wrong.mp3")
                                            .headers(headers_18),
                                    http("request_24")
                                            .get("http://" + uri1 + "/placeholder.svg")
                                            .headers(headers_24),
                                    http("request_25")
                                            .get("http://" + uri1 + "/homeBackground30fps.mp4")
                                            .headers(headers_25),
                                    http("request_26")
                                            .get("http://" + uri1 + "/homeBackground30fps.mp4")
                                            .headers(headers_26),
                                    http("request_27")
                                            .get("http://" + uri1 + "/homeBackground30fps.mp4")
                                            .headers(headers_27)
                            ),
                    http("request_17")
                            .options("/game/question")
                            .headers(headers_16)
                            .resources(
                                    http("Get question 1")
                                            .get("/game/question")
                                            .headers(headers_22)
                            ),
                    http("request_37")
                            .options("/game/answer")
                            .headers(headers_37)
                            .resources(
                                    http("Get answer 1")
                                            .post("/game/answer")
                                            .headers(headers_38)
                                            .body(RawFileBody("0038_request.json"))
                            ),
                    http("request_39")
                            .options("/game/question")
                            .headers(headers_16)
                            .resources(
                                    http("Get question 2")
                                            .get("/game/question")
                                            .headers(headers_40)
                            ),
                    http("request_41")
                            .options("/game/hint")
                            .headers(headers_37)
                            .resources(
                                    http("Get hint 1")
                                            .post("/game/hint")
                                            .headers(headers_38)
                                            .body(RawFileBody("0042_request.json"))
                            ),
                    http("request_43")
                            .options("/game/hint")
                            .headers(headers_37)
                            .resources(
                                    http("Get hint 2")
                                            .post("/game/hint")
                                            .headers(headers_38)
                                            .body(RawFileBody("0044_request.json"))
                            ),
                    http("request_45")
                            .options("/game/answer")
                            .headers(headers_37)
                            .resources(
                                    http("Get answer 2")
                                            .post("/game/answer")
                                            .headers(headers_38)
                                            .body(RawFileBody("0046_request.json"))
                            ),
                    http("request_47")
                            .options("/game/question")
                            .headers(headers_16)
                            .resources(
                                    http("Get question 3")
                                            .get("/game/question")
                                            .headers(headers_48)
                            ),
                    http("request_49")
                            .options("/game/answer")
                            .headers(headers_37)
                            .resources(
                                    http("Get answer 3")
                                            .post("/game/answer")
                                            .headers(headers_50)
                                            .body(RawFileBody("0050_request.json"))
                            ),
                    http("request_51")
                            .options("/game/save")
                            .headers(headers_51)
                            .resources(
                                    http("Finish game")
                                            .post("/game/save")
                                            .headers(headers_36)
                            ),
                    http("request_56")
                            .options("/stats/users/randomuser1")
                            .headers(headers_16)
                            .resources(
                                    http("Get stats")
                                            .get("/stats/users/randomuser1")
                                            .headers(headers_36)
                            )
            );

    {
        setUp(scn.injectOpen(atOnceUsers(20))).protocols(httpProtocol);
    }
}

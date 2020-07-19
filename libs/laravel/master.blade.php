<!doctype html>
<html class="no-js" lang="vi">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="content-language" content="en" />

        <script>
            // www to non-www
            if (location.href.indexOf("//www.") !== -1) {
                location.href = location.href.replace("//www.", "//");
            }
            // fix url after facebook login
            if (window.location.hash && window.location.hash === '#_=_') {
                history.pushState({}, '', location.href.replace('#_=_', ''));
            }
        </script>

        @if (!env('PRODUCTION', false))
            {{--Begin Prevent Google Bot--}}
            <meta name="robots" content="noindex, nofollow">
            <meta name="googlebot" content="noindex, nofollow">
            {{--End Prevent Google Bot--}}
        @endif

        <!-- SEO -->
        @if(isset($title) && $title)
            <title>{{ $title }} - {{ getOption('title') }}</title>
        @elseif(View::hasSection('title'))
            <title>@yield('title') - {{ getOption('title') }}</title>
        @else
            <title>{{ getOption('title') }}</title>
        @endif

        @yield('meta_keywords', string_to_html('<meta name="keywords" content="' . getOption('meta_keyword') . '"/>'))
        @yield('meta_description', string_to_html('<meta name="description" content="' . ($meta_description = getOption('meta_description')) . '"/>'))

        @section('meta_og')
            <meta property="og:url" 		 content="{!! Request::url() !!}" />
            <meta property="og:type" 		 content="website" />
            <meta property="og:title" 		 content="{{ isset($title) ? $title . '|' . getOption('title') : getOption('title') }}" />
            <meta property="og:description"  content="{{ $meta_description }}" />

            @if($logo = getOption('logo'))
                <meta property="og:image" 		 content="{{ static_file($logo) }}" />
                <meta property="og:image:width"  content="600" />
                <meta property="og:image:height" content="315" />
            @endif
        @show
        @if(!empty($facebook_app_id = env('FACEBOOK_CLIENT_ID')))
            <meta property="fb:app_id" content="{{ $facebook_app_id }}" />
        @endif

        <!-- Viewport and mobile -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0">

        <!-- FAVICON -->
        <link rel="image_src" href="{{ $fav = static_file(getOption('favicon')) }}" />
        <link rel="icon" type="images/gif" href="{{ $fav }}" />

        <!-- CSS: Stylesheet for the website -->
        <link rel="stylesheet" href="{{ static_cdn_file('css/main.css?v=' . $random_version) }}"> <!-- Generated CSS by Sass -->
        <link rel="stylesheet" href="{{ static_cdn_file('css/pure.css?v=' . $random_version) }}" as="style" onload="this.onload=null;this.rel='stylesheet'"> <!-- Generated CSS by Sass -->
        <noscript>
            <link rel="stylesheet" href="{{ static_cdn_file('css/pure.css?v=' . time()) }}">
        </noscript>
        <link rel="stylesheet" href="{{ static_cdn_file('css/helper.css?v=' . time()) }}" as="style" onload="this.onload=null;this.rel='stylesheet'"> <!-- Generated CSS by Sass -->
        <noscript>
            <link rel="stylesheet" href="{{ static_cdn_file('css/helper.css?v=' . time()) }}">
        </noscript>
        <link rel="stylesheet" href="{{ static_file('static/frontend/js/plugins/sweetalert2/sweetalert2.css') }}"> <!-- Pure CSS for backend backup -->
        {{--<link rel="stylesheet" href="{{ static_cdn_file('css/lqt.css?v=' . $random_version) }}"> <!-- Pure CSS for backend backup -->--}}

        <script src="{{ static_cdn_file('js/libraries/jquery.min.js') }}"></script>
        <script src="{{ static_file('static/frontend/js/jquery.validate.min.js') }}"></script>
        <script src="{{ static_file('static/frontend/js/additional-methods.js') }}"></script>
        <script async defer src="{{ static_file('static/frontend/js/core.js') }}"></script>
{{--        <script src="{{ static_file('static/frontend/js/plugins/sweetalert2/sweetalert2.min.js') }}"></script>--}}/

        @yield('styles')

        <script>
            var basePath = '{{ url('/') }}',
                {{--path_resource = '{{ static_file('static/frontend') }}/';--}}
                path_resource = '{{ static_cdn_file('/') }}';
        </script>

        @yield('scripts-header')

        {!! getOption('header_html_code')!!}
    </head>

    <body>

        {!! getOption('body_first_html_code') !!}

        <!-- HEADER / MENU NAVIGATION -->
        @@include('../../src/partials/menu.html', {"active_nav_class": ""})

        <!-- main tag (main content) -->
        @yield('content')

        <!-- FOOTER -->
        @@include('../../src/partials/footer.html')

        <!-- POPUPS / MODALS -->
        @@include('../../src/partials/popups.html')

        <!-- Default Javascript files -->
        <script async defer src="{{ static_cdn_file('js/plugins/lazysizes/lazysizes.min.js?v=' . $random_version) }}"></script> <!-- frontend -->
        <script async defer src="{{ static_cdn_file('js/main.js?v=' . $random_version) }}"></script> <!-- frontend -->
        <script async defer src="{{ static_file('static/frontend/js/lqt.js?v=' . $random_version) }}"></script> <!-- backend -->

        <script>
            // var PRELOADER={init:function(){},show:function(e){document.getElementById('preloader').classList.remove('helper-hide')},hide:function(e){document.getElementById('preloader').classList.add('helper-hide')}};

            $(document).ready(function() {
                @if (count($errors) > 0)
                    var errors = '';
                    @foreach (array_unique($errors->all()) as $error)
                        errors += "{!! $error !!}\n";
                    @endforeach

                    swal({
                        title: 'Thông báo',
                        text: errors
                    });
                @endif

                @if (Session::has('flash_message'))
                    var icon = 'success';
                    if ('{{ Session::get('flash_level') }}' === 'danger') {
                        icon = 'error';
                    }
                    swal("Thông báo", "{!! Session::get('flash_message') !!}" , icon);
                @endif
            });
        </script>

        {!! getOption('footer_html_code')!!}

        @yield('scripts')

        @if(!empty($facebook_app_id))
            <div id="fb-root"></div>
            <script>(function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.8&appId={{ $facebook_app_id }}";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));</script>
        @endif

    </body>
</html>